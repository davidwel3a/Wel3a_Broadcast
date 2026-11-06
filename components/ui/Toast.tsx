'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 ltr:right-5 rtl:left-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = {
          success: { icon: <CheckCircle2 size={18} className="text-success" />, border: 'border-success/30' },
          error: { icon: <AlertCircle size={18} className="text-danger" />, border: 'border-danger/30' },
          warning: { icon: <AlertTriangle size={18} className="text-warning" />, border: 'border-warning/30' },
          info: { icon: <Info size={18} className="text-accent" />, border: 'border-accent/30' },
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 bg-surface/95 border rounded-lg shadow-lg backdrop-blur-md text-xs font-medium text-text animate-in slide-in-from-bottom-2 ${config.border}`}
          >
            <div className="flex items-center gap-2.5">
              {config.icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-text-muted hover:text-text p-1 transition-colors"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
