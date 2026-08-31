import { X, XCircle } from "lucide-react";
import type { Toast } from "react-hot-toast";
import toast from "react-hot-toast";

interface ErrorToastProps {
  t: Toast;
  title: string;
  description?: string;
}

export const ErrorToast = ({ t, title, description }: ErrorToastProps) => {
  return (
    <div
      className={`pointer-events-auto group relative flex w-[380px] items-start gap-3.5 overflow-hidden rounded-xl border border-red-500/20 bg-card px-4 py-3.5 shadow-lg transition-all duration-300 ease-out hover:border-red-500/30 hover:shadow-xl
        ${
          t.visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }
      `}
    >
      <div className="absolute inset-y-0 left-0 w-[6px] bg-red-500" />
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-red-500/15 bg-red-500/10 shadow-sm
        "
      >
        <XCircle size={17} strokeWidth={2.3} className="text-red-500" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold leading-5 text-primary">{title}</p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-secondary/60 opacity-70 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 hover:opacity-100 active:scale-90
        "
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
};
