import React from 'react';
import Button from './Button';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isConfirmLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   isOpen,
                                                                   title,
                                                                   message,
                                                                   confirmLabel = 'Potwierdź',
                                                                   cancelLabel = 'Anuluj',
                                                                   onConfirm,
                                                                   onCancel,
                                                                   isConfirmLoading = false
                                                               }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                        disabled={isConfirmLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isConfirmLoading}
                    >
                        {isConfirmLoading ? 'Przetwarzanie...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;