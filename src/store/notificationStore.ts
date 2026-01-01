/**
 * GRADE A REALTY - Notification Store
 * Zustand-based state management for notifications
 * Phase 1 Implementation
 */

import { create } from 'zustand';
import type { Notification } from '../types';

// =============================================================================
// TOAST TYPES
// =============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface NotificationState {
    // In-app notifications
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    // Toast notifications
    toasts: Toast[];

    // Panel state
    isPanelOpen: boolean;
}

interface NotificationStore extends NotificationState {
    // Notification actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    setLoading: (isLoading: boolean) => void;

    // Toast actions
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Panel actions
    togglePanel: () => void;
    openPanel: () => void;
    closePanel: () => void;

    // Computed
    getUnreadNotifications: () => Notification[];
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    toasts: [],
    isPanelOpen: false,
};

// =============================================================================
// HELPER
// =============================================================================

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// =============================================================================
// NOTIFICATION STORE
// =============================================================================

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    ...initialState,

    // ---------------------------------------------------------------------------
    // NOTIFICATION ACTIONS
    // ---------------------------------------------------------------------------

    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        isLoading: false,
    }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    })),

    markAsRead: (id) => set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (!notification || notification.read) return state;

        return {
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        };
    }),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
            readAt: n.read ? n.readAt : new Date().toISOString(),
        })),
        unreadCount: 0,
    })),

    removeNotification: (id) => set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
        };
    }),

    clearNotifications: () => set({
        notifications: [],
        unreadCount: 0,
    }),

    setLoading: (isLoading) => set({ isLoading }),

    // ---------------------------------------------------------------------------
    // TOAST ACTIONS
    // ---------------------------------------------------------------------------

    addToast: (toast) => {
        const id = generateId();
        const newToast: Toast = { ...toast, id };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto-remove after duration (default 5 seconds)
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, duration);
        }
    },

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),

    clearToasts: () => set({ toasts: [] }),

    // ---------------------------------------------------------------------------
    // PANEL ACTIONS
    // ---------------------------------------------------------------------------

    togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
    openPanel: () => set({ isPanelOpen: true }),
    closePanel: () => set({ isPanelOpen: false }),

    // ---------------------------------------------------------------------------
    // COMPUTED
    // ---------------------------------------------------------------------------

    getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read);
    },
}));

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Show a success toast
 */
export const showSuccessToast = (title: string, message?: string) => {
    useNotificationStore.getState().addToast({
        type: 'success',
        title,
        message,
    });
};

/**
 * Show an error toast
 */
export const showErrorToast = (title: string, message?: string) => {
    useNotificationStore.getState().addToast({
        type: 'error',
        title,
        message,
        duration: 8000, // Errors stay longer
    });
};

/**
 * Show a warning toast
 */
export const showWarningToast = (title: string, message?: string) => {
    useNotificationStore.getState().addToast({
        type: 'warning',
        title,
        message,
    });
};

/**
 * Show an info toast
 */
export const showInfoToast = (title: string, message?: string) => {
    useNotificationStore.getState().addToast({
        type: 'info',
        title,
        message,
    });
};

// =============================================================================
// SELECTORS
// =============================================================================

export const selectNotifications = (state: NotificationStore) => state.notifications;
export const selectUnreadCount = (state: NotificationStore) => state.unreadCount;
export const selectToasts = (state: NotificationStore) => state.toasts;
export const selectIsPanelOpen = (state: NotificationStore) => state.isPanelOpen;

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook for notifications
 */
export const useNotifications = () => {
    const notifications = useNotificationStore(selectNotifications);
    const unreadCount = useNotificationStore(selectUnreadCount);
    const isLoading = useNotificationStore((state) => state.isLoading);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

    return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
};

/**
 * Hook for toasts
 */
export const useToasts = () => {
    const toasts = useNotificationStore(selectToasts);
    const removeToast = useNotificationStore((state) => state.removeToast);

    return { toasts, removeToast };
};

/**
 * Hook for notification panel
 */
export const useNotificationPanel = () => {
    const isPanelOpen = useNotificationStore(selectIsPanelOpen);
    const togglePanel = useNotificationStore((state) => state.togglePanel);
    const openPanel = useNotificationStore((state) => state.openPanel);
    const closePanel = useNotificationStore((state) => state.closePanel);

    return { isPanelOpen, togglePanel, openPanel, closePanel };
};
