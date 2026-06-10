import { useCallback, useState } from 'react';

export interface Toast {
  id: number;
  msg: string;
  type: '' | 'success' | 'error';
}

let nextId = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string, type: Toast['type'] = '') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}
