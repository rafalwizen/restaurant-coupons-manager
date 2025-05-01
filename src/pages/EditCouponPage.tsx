import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CouponCreate, CouponDetail, CouponUpdate } from '../types/coupon.types';
import { couponService } from '../api/couponService';
import CouponForm from '../components/coupons/CouponForm';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useToast } from '../contexts/ToastContext';

const EditCouponPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [coupon, setCoupon] = useState<CouponDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCouponDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const response = await couponService.getCouponById(parseInt(id));
                if (response.success) {
                    setCoupon(response.data as CouponDetail);
                } else {
                    setError(response.message || 'Nie udało się pobrać szczegółów kuponu');
                }
            } catch (err) {
                setError('Wystąpił błąd podczas pobierania szczegółów kuponu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCouponDetail();
    }, [id]);

    const handleSubmit = async (values: CouponCreate) => {
        if (!id) return;

        try {
            setIsSubmitting(true);
            setError(null);

            // Tworzenie obiektu aktualizacji
            const updateData: CouponUpdate = { ...values };

            const response = await couponService.updateCoupon(parseInt(id), updateData);
            if (response.success) {
                showToast('Kupon został zaktualizowany pomyślnie', 'success');
                navigate('/admin/coupons');
            } else {
                setError(response.message || 'Nie udało się zaktualizować kuponu');
            }
        } catch (err) {
            setError('Wystąpił błąd podczas aktualizacji kuponu');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error && !coupon) return <ErrorDisplay message={error} />;
    if (!coupon) return <ErrorDisplay message="Kupon nie został znaleziony" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Edytuj kupon</h1>
                    <Button
                        onClick={() => navigate('/admin/coupons')}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Powrót do listy
                    </Button>
                </div>

                {error && <ErrorDisplay message={error} className="mb-6" />}

                <CouponForm
                    initialValues={coupon}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default EditCouponPage;
