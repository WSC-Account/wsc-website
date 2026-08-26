import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkLoadError: boolean;
}

const CHUNK_RELOAD_STORAGE_PREFIX = "wsc:chunk-load-reload:";
const CHUNK_LOAD_ERROR_PATTERNS = [
  /ChunkLoadError/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Loading chunk \d+ failed/i,
];

export function isRecoverableChunkLoadError(error: unknown): boolean {
  const errorText =
    error instanceof Error
      ? `${error.name} ${error.message} ${error.stack ?? ""}`
      : String(error);

  return CHUNK_LOAD_ERROR_PATTERNS.some((pattern) => pattern.test(errorText));
}

function chunkReloadStorageKey() {
  const route =
    typeof window === "undefined"
      ? "unknown"
      : `${window.location.origin}${window.location.pathname}${window.location.search}`;

  return `${CHUNK_RELOAD_STORAGE_PREFIX}${route}`;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkLoadError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isChunkLoadError: isRecoverableChunkLoadError(error),
    };
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(chunkReloadStorageKey());
    }
  }

  componentDidCatch(error: Error) {
    if (!isRecoverableChunkLoadError(error) || typeof window === "undefined") {
      return;
    }

    const storageKey = chunkReloadStorageKey();

    if (window.sessionStorage.getItem(storageKey) === "1") {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const title = this.state.isChunkLoadError
        ? "Refreshing the latest page version."
        : "An unexpected error occurred.";
      const message = this.state.isChunkLoadError
        ? "This can happen right after a website update. If the page does not refresh automatically, use the button below."
        : "Please reload the page and try again.";

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-3 text-center">{title}</h2>

            <p className="text-sm text-muted-foreground text-center mb-6">
              {message}
            </p>

            {!this.state.isChunkLoadError ? (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6">
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                  {this.state.error?.stack}
                </pre>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
