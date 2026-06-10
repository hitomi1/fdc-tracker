import type { Toast } from '../lib/useToasts';

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div id="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}
