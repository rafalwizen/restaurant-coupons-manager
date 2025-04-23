import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type: ToastType) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    toasts: [],
    showToast: () => {},
    hideToast: () => {},
});

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            hideToast(id);
        }, 5000);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);