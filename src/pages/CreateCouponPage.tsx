import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CouponCreate } from '../types/coupon.types';
import { couponService } from '../api/couponService';
import CouponForm from '../components/coupons/CouponForm';
import Button from '../components/ui/Button';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useToast } from '../contexts/ToastContext';

const CreateCouponPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: CouponCreate) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const response = await couponService.createCoupon(values);
            if (response.success) {
                showToast('Kupon został utworzony pomyślnie', 'success');
                navigate('/admin/coupons');
            } else {
                setError(response.message || 'Nie udało się utworzyć kuponu');
            }
        } catch (err) {
            setError('Wystąpił błąd podczas tworzenia kuponu');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Utwórz nowy kupon</h1>
                    <Button
                        onClick={() => navigate('/admin/coupons')}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Powrót do listy
                    </Button>
                </div>

                {error && <ErrorDisplay message={error} className="mb-6" />}

                <CouponForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
};

export default CreateCouponPage;
