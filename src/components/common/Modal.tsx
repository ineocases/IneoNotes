import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, title, children, onClose }: {
  open: boolean; title: string; children: ReactNode; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1b1d24]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <ButtonIcon label="Cerrar" onClick={onClose}><X size={20} /></ButtonIcon>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ButtonIcon({ label, children, onClick }: { label: string; children: ReactNode; onClick?: () => void }) {
  return <button aria-label={label} onClick={onClick} className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10">{children}</button>;
}