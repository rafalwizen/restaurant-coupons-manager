import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CouponDetail } from '../types/coupon.types';
import { couponService } from '../api/couponService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useToast } from '../contexts/ToastContext';

const CouponDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [coupon, setCoupon] = useState<CouponDetail | null>(null);
    const [loading, setLoading] = useState(true);
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

    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this coupon?')) return;

        try {
            setLoading(true);
            const response = await couponService.deleteCoupon(parseInt(id));
            if (response.success) {
                showToast('Coupon deleted successfully', 'success');
                navigate('/admin/coupons');
            } else {
                showToast(response.message || 'Failed to delete coupon', 'error');
            }
        } catch (err) {
            showToast('An error occurred while deleting the coupon', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!coupon) return <ErrorDisplay message="Coupon not found" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{coupon.name}</h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate('/admin/coupons')}
                            className="bg-gray-600 hover:bg-gray-700"
                        >
                            Back to List
                        </Button>
                        <Button
                            onClick={() => navigate(`/admin/coupons/${id}/edit`)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="font-medium">ID:</div>
                            <div className="col-span-2">{coupon.id}</div>

                            <div className="font-medium">Discount:</div>
                            <div className="col-span-2">{coupon.discountValue}%</div>

                            <div className="font-medium">Status:</div>
                            <div className="col-span-2">
                                <span className={`px-2 py-1 rounded text-white ${coupon.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-lg font-semibold mb-2 mt-6">Coupon Image</h2>
                        {coupon.imageId && coupon.imageUrl ? (
                            <div className="border rounded p-2 bg-gray-50">
                                <img
                                    src={coupon.imageUrl}
                                    alt={coupon.name}
                                    className="max-w-full h-auto max-h-48 object-contain"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No image associated with this coupon</p>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="mb-4 whitespace-pre-wrap">{coupon.description || 'No description provided.'}</p>

                        <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
                        <p className="whitespace-pre-wrap">{coupon.termsAndConditions || 'No terms and conditions specified.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponDetailPage;
