'use client';

import { useCallback, useState } from 'react';
import type { ToastType } from '@/components/ui/Toast';

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const success = useCallback(
    (message: string) => show(message, 'success'),
    [show]
  );
  const error = useCallback(
    (message: string) => show(message, 'error'),
    [show]
  );
  const info = useCallback((message: string) => show(message, 'info'), [show]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, show, success, error, info, dismiss };
}
