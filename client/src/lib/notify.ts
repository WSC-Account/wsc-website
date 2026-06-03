type ToastKind = "success" | "error";

async function showToast(kind: ToastKind, message: string) {
  const { toast } = await import("sonner");
  toast[kind](message);
}

export function notifySuccess(message: string) {
  void showToast("success", message);
}

export function notifyError(message: string) {
  void showToast("error", message);
}
