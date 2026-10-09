export const FORM_REQUEST_CACHE_KEY = "wsc-pending-form-requests";
export const FORM_REQUEST_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_PENDING_FORM_REQUESTS = 32;

type RequestStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type PendingFormRequest = {
  key: string;
  scopeFingerprint: string;
  fingerprint: string;
  createdAt: number;
  expiresAt: number;
};

type CacheOptions = {
  storage?: () => RequestStorage;
  now?: () => number;
};

async function fingerprint(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function validEntry(value: unknown, now: number): value is PendingFormRequest {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<PendingFormRequest>;
  return (
    typeof entry.key === "string" &&
    /^[0-9a-f-]{36}$/.test(entry.key) &&
    typeof entry.scopeFingerprint === "string" &&
    /^[0-9a-f]{64}$/.test(entry.scopeFingerprint) &&
    typeof entry.fingerprint === "string" &&
    /^[0-9a-f]{64}$/.test(entry.fingerprint) &&
    typeof entry.createdAt === "number" &&
    Number.isFinite(entry.createdAt) &&
    entry.createdAt <= now &&
    entry.expiresAt === entry.createdAt + FORM_REQUEST_TTL_MS &&
    entry.expiresAt > now
  );
}

// sessionStorage survives a reload but stays local to this tab. Neither it nor
// the memory fallback stores form fields, attachment data, or readable URLs.
export function createFormRequestCache({
  storage = () => window.sessionStorage,
  now = Date.now,
}: CacheOptions = {}) {
  let memory: PendingFormRequest[] = [];
  let storageBlocked = false;

  const prune = (entries: unknown[]) =>
    entries
      .filter((entry): entry is PendingFormRequest => validEntry(entry, now()))
      .sort((left, right) => right.createdAt - left.createdAt)
      .slice(0, MAX_PENDING_FORM_REQUESTS)
      .map(({ key, scopeFingerprint, fingerprint, createdAt, expiresAt }) => ({
        key,
        scopeFingerprint,
        fingerprint,
        createdAt,
        expiresAt,
      }));

  const read = () => {
    if (!storageBlocked) {
      let raw: string | null = null;
      try {
        raw = storage().getItem(FORM_REQUEST_CACHE_KEY);
      } catch {
        storageBlocked = true;
      }
      if (!storageBlocked) {
        try {
          const parsed: unknown = raw ? JSON.parse(raw) : [];
          memory = Array.isArray(parsed) ? prune(parsed) : [];
        } catch {
          memory = [];
        }
      }
    }
    memory = prune(memory);
    return memory;
  };

  const write = (entries: PendingFormRequest[]) => {
    memory = prune(entries);
    if (storageBlocked) return;
    try {
      if (memory.length)
        storage().setItem(FORM_REQUEST_CACHE_KEY, JSON.stringify(memory));
      else storage().removeItem(FORM_REQUEST_CACHE_KEY);
    } catch {
      storageBlocked = true;
    }
  };

  return {
    async claim(scope: string, body: string): Promise<PendingFormRequest> {
      const [scopeFingerprint, payloadFingerprint] = await Promise.all([
        fingerprint(scope),
        fingerprint(body),
      ]);
      const entries = read();
      const existing = entries.find(
        entry => entry.scopeFingerprint === scopeFingerprint
      );
      if (existing?.fingerprint === payloadFingerprint) {
        write(entries); // Persist pruning without extending the original retry window.
        return existing;
      }
      const createdAt = now();
      const pending = {
        key: crypto.randomUUID(),
        scopeFingerprint,
        fingerprint: payloadFingerprint,
        createdAt,
        expiresAt: createdAt + FORM_REQUEST_TTL_MS,
      };
      write([
        pending,
        ...entries.filter(entry => entry.scopeFingerprint !== scopeFingerprint),
      ]);
      return pending;
    },
    complete(request: PendingFormRequest) {
      write(read().filter(entry => entry.key !== request.key));
    },
  };
}

export const formRequestCache = createFormRequestCache();
