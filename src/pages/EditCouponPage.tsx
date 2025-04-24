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
                    setError(response.message || 'Failed to fetch coupon details');
                }
            } catch (err) {
                setError('An error occurred while fetching coupon details');
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

            // Create update object
            const updateData: CouponUpdate = { ...values };

            const response = await couponService.updateCoupon(parseInt(id), updateData);
            if (response.success) {
                showToast('Coupon updated successfully', 'success');
                navigate('/admin/coupons');
            } else {
                setError(response.message || 'Failed to update coupon');
            }
        } catch (err) {
            setError('An error occurred while updating the coupon');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error && !coupon) return <ErrorDisplay message={error} />;
    if (!coupon) return <ErrorDisplay message="Coupon not found" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Edit Coupon</h1>
                    <Button
                        onClick={() => navigate('/admin/coupons')}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Back to List
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