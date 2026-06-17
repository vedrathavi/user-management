import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-500/10 p-3 text-red-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-neutral-100">{title}</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-800/60">
          <button
            onClick={onCancel}
            className="rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-md shadow-red-500/10"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
