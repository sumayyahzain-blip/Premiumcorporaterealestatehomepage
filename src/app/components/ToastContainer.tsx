/**
 * GRADE A REALTY - Toast Notification Component
 * Animated toast notifications
 * Phase 1 Implementation
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToasts } from '../../store';
import type { Toast } from '../../store/notificationStore';

// Toast Container - place this in your app layout
export function ToastContainer() {
    const { toasts, removeToast } = useToasts();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Individual Toast Item
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <XCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    const backgrounds = {
        success: 'bg-green-500/10 border-green-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        warning: 'bg-amber-500/10 border-amber-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div
            className={`
        pointer-events-auto
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
        >
            <div
                className={`
          backdrop-blur-xl border rounded-xl p-4 shadow-2xl
          ${backgrounds[toast.type]}
        `}
            >
                <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        {icons[toast.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{toast.title}</p>
                        {toast.message && (
                            <p className="text-gray-400 text-sm mt-1">{toast.message}</p>
                        )}
                        {toast.action && (
                            <button
                                onClick={toast.action.onClick}
                                className="mt-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                {toast.action.label}
                            </button>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Standalone toast functions (can be called from anywhere)
export { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '../../store';
