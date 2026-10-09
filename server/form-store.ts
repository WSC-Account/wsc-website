import { requestJson, type FetchImplementation } from "./form-http.js";

export interface FormStore {
  readonly durable: boolean;
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  lock(key: string, owner: string, ttlSeconds: number): Promise<boolean>;
  unlock(key: string, owner: string): Promise<void>;
  increment(key: string, windowSeconds: number): Promise<number>;
}

/** Local fallback only: limits and deduplication do not span instances or restarts. */
export class MemoryFormStore implements FormStore {
  readonly durable = false;
  private readonly entries = new Map<
    string,
    { value: unknown; expiresAt: number }
  >();

  constructor(private readonly now: () => number = Date.now) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return null;
    }
    return structuredClone(entry.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number) {
    this.prune();
    this.entries.set(key, {
      value: structuredClone(value),
      expiresAt: this.now() + ttlSeconds * 1_000,
    });
  }

  async lock(key: string, owner: string, ttlSeconds: number) {
    // No await between the check and set: callers in one process acquire atomically.
    const entry = this.entries.get(key);
    if (entry && entry.expiresAt > this.now()) return false;
    this.prune();
    this.entries.set(key, {
      value: owner,
      expiresAt: this.now() + ttlSeconds * 1_000,
    });
    return true;
  }

  async unlock(key: string, owner: string) {
    if (this.entries.get(key)?.value === owner) this.entries.delete(key);
  }

  async increment(key: string, windowSeconds: number) {
    const entry = this.entries.get(key);
    const valid = entry && entry.expiresAt > this.now();
    const count = valid ? Number(entry.value) + 1 : 1;
    this.prune();
    this.entries.set(key, {
      value: count,
      expiresAt: valid ? entry.expiresAt : this.now() + windowSeconds * 1_000,
    });
    return count;
  }

  private prune() {
    if (this.entries.size < 5_000) return;
    for (const [key, entry] of Array.from(this.entries)) {
      if (entry.expiresAt <= this.now()) this.entries.delete(key);
    }
    if (this.entries.size >= 5_000) {
      throw new Error("Local form coordination capacity exceeded.");
    }
  }
}

/** Redis REST protocol supported by Upstash and Vercel KV; no browser credentials. */
export class RedisFormStore implements FormStore {
  readonly durable = true;

  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly fetchImplementation: FetchImplementation = fetch,
    private readonly timeoutMs = 5_000,
    private readonly prefix = "wsc:forms:v1:"
  ) {
    if (!url.startsWith("https://"))
      throw new Error("Form storage requires an HTTPS Redis REST URL.");
  }

  private async command(command: Array<string | number>) {
    const response = await requestJson(
      this.url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      },
      this.fetchImplementation,
      this.timeoutMs
    );
    if (!response.ok || response.body.error || !("result" in response.body)) {
      throw new Error("Shared form storage is unavailable.");
    }
    return response.body.result;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.command(["GET", this.prefix + key]);
    if (value === null) return null;
    if (typeof value !== "string")
      throw new Error("Invalid shared form storage response.");
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number) {
    const result = await this.command([
      "SET",
      this.prefix + key,
      JSON.stringify(value),
      "EX",
      ttlSeconds,
    ]);
    if (result !== "OK") {
      throw new Error("Shared form storage did not acknowledge the write.");
    }
  }

  async lock(key: string, owner: string, ttlSeconds: number) {
    return (
      (await this.command([
        "SET",
        this.prefix + key,
        owner,
        "EX",
        ttlSeconds,
        "NX",
      ])) === "OK"
    );
  }

  async unlock(key: string, owner: string) {
    await this.command([
      "EVAL",
      "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
      1,
      this.prefix + key,
      owner,
    ]);
  }

  async increment(key: string, windowSeconds: number) {
    const result = await this.command([
      "EVAL",
      "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
      1,
      this.prefix + key,
      windowSeconds,
    ]);
    if (typeof result !== "number")
      throw new Error("Invalid shared rate limit response.");
    return result;
  }
}

const localStore = new MemoryFormStore();

export function configuredFormStore(): FormStore {
  const url =
    process.env.FORM_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.FORM_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();
  if (url || token) {
    if (!url || !token)
      throw new Error("Both form Redis REST URL and token must be configured.");
    return new RedisFormStore(url, token);
  }
  return localStore;
}
