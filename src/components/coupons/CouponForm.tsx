import React, { useState } from 'react';
import { CouponCreate, CouponDetail } from '../../types/coupon.types';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import ImageSelector from "../images/ImageSelector.tsx";

interface CouponFormProps {
    initialValues?: CouponDetail;
    onSubmit: (values: CouponCreate) => void;
    isSubmitting: boolean;
}

interface ValidationErrors {
    name?: string;
    description?: string;
    discountValue?: string;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
}

const CouponForm: React.FC<CouponFormProps> = ({ initialValues, onSubmit, isSubmitting }) => {
    const [values, setValues] = useState<CouponCreate>({
        name: initialValues?.name || '',
        description: initialValues?.description || '',
        discountValue: initialValues?.discountValue || 0,
        validFrom: initialValues?.validFrom ? initialValues.validFrom.substring(0, 16) : '',
        validTo: initialValues?.validTo ? initialValues.validTo.substring(0, 16) : '',
        termsAndConditions: initialValues?.termsAndConditions || '',
        isActive: initialValues?.isActive !== undefined ? initialValues.isActive : true,
        imageId: initialValues?.imageId || undefined
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setValues(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setValues(prev => ({ ...prev, [name]: value }));
        }

        // Clear error on field change
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Name validation
        if (!values.name) {
            newErrors.name = 'Name is required';
        } else if (values.name.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        }

        // Description validation
        if (values.description && values.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        // Discount validation
        if (values.discountValue === undefined) {
            newErrors.discountValue = 'Discount value is required';
        } else if (isNaN(Number(values.discountValue)) || Number(values.discountValue) < 0) {
            newErrors.discountValue = 'Discount value must be a positive number';
        }

        // Date validations
        if (!values.validFrom) {
            newErrors.validFrom = 'Valid from date is required';
        }

        if (!values.validTo) {
            newErrors.validTo = 'Valid to date is required';
        } else if (values.validFrom && values.validTo && new Date(values.validFrom) >= new Date(values.validTo)) {
            newErrors.validTo = 'Valid to date must be after valid from date';
        }

        // Terms validation
        if (values.termsAndConditions && values.termsAndConditions.length > 1000) {
            newErrors.termsAndConditions = 'Terms and conditions must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageSelect = (imageId: number | null) => {
        setValues(prev => ({ ...prev, imageId: imageId || undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Format dates for backend
            const submitValues = {
                ...values,
                validFrom: new Date(values.validFrom).toISOString(),
                validTo: new Date(values.validTo).toISOString(),
                discountValue: Number(values.discountValue)
            };
            onSubmit(submitValues);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                required
                maxLength={100}
            />

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Image (optional)
                </label>
                <ImageSelector
                    selectedImageId={values.imageId}
                    onImageSelect={handleImageSelect}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={values.description || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    maxLength={500}
                    rows={4}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <FormInput
                label="Discount Value (%)"
                name="discountValue"
                type="number"
                value={values.discountValue.toString()}
                onChange={handleChange}
                error={errors.discountValue}
                required
                min={0}
                max={100}
                step={0.01}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Valid From"
                    name="validFrom"
                    type="datetime-local"
                    value={values.validFrom}
                    onChange={handleChange}
                    error={errors.validFrom}
                    required
                />

                <FormInput
                    label="Valid To"
                    name="validTo"
                    type="datetime-local"
                    value={values.validTo}
                    onChange={handleChange}
                    error={errors.validTo}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms and Conditions
                </label>
                <textarea
                    name="termsAndConditions"
                    value={values.termsAndConditions || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    maxLength={1000}
                    rows={6}
                />
                {errors.termsAndConditions && (
                    <p className="mt-1 text-sm text-red-600">{errors.termsAndConditions}</p>
                )}
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={values.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                </label>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting ? 'Saving...' : (initialValues ? 'Update Coupon' : 'Create Coupon')}
                </Button>
            </div>
        </form>
    );
};

export default CouponForm;