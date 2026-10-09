export type FetchImplementation = typeof fetch;

export class ProviderTimeoutError extends Error {
  constructor() {
    super("The external service did not respond in time.");
    this.name = "ProviderTimeoutError";
  }
}

/** Keep the deadline active while reading the body, not just until headers arrive. */
export async function requestJson(
  url: string,
  init: RequestInit,
  fetchImplementation: FetchImplementation = fetch,
  timeoutMs = 10_000
): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      (async () => {
        const response = await fetchImplementation(url, {
          ...init,
          signal: controller.signal,
        });
        const text = await response.text();
        let body: Record<string, unknown> = {};
        if (text) {
          try {
            const parsed: unknown = JSON.parse(text);
            body =
              typeof parsed === "object" &&
              parsed !== null &&
              !Array.isArray(parsed)
                ? (parsed as Record<string, unknown>)
                : { response: parsed };
          } catch {
            body = { response: text.slice(0, 500) };
          }
        }
        return { ok: response.ok, status: response.status, body };
      })(),
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(new ProviderTimeoutError());
          controller.abort();
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
