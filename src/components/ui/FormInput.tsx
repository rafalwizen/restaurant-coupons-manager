import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, fullWidth = true, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const widthClass = fullWidth ? 'w-full' : '';
        const errorClass = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500';

        return (
            <div className={`mb-4 ${widthClass}`}>
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`p-2 border rounded focus:outline-none focus:ring-2 ${errorClass} ${widthClass} ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;