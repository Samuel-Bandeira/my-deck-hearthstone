import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="glass-panel w-full max-w-sm border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {title}
          </h2>
        </div>

        <p className="text-sm text-on-surface-variant font-body leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant border border-outline-variant/30 hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest gold-gradient-btn text-on-primary-fixed hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(230,195,88,0.3)]"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
