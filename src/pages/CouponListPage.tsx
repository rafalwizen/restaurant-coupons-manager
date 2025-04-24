import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CouponListParams, CouponSummary } from '../types/coupon.types';
import { couponService } from '../api/couponService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useToast } from '../contexts/ToastContext';

const CouponListPage: React.FC = () => {
    const [coupons, setCoupons] = useState<CouponSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [params, setParams] = useState<CouponListParams>({
        page: 0,
        size: 10,
        sortBy: 'id',
        direction: 'asc'
    });
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Fetch coupons on initial load and when params change
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await couponService.getCoupons(params);
                if (response.success) {
                    setCoupons(response.data as CouponSummary[]);
                } else {
                    setError(response.message || 'Failed to fetch coupons');
                }
            } catch (err) {
                setError('An error occurred while fetching coupons');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, [params]);

    const handleSort = (field: string) => {
        setParams(prevParams => ({
            ...prevParams,
            sortBy: field,
            direction: prevParams.sortBy === field && prevParams.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (newPage: number) => {
        setParams(prevParams => ({ ...prevParams, page: newPage }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                setLoading(true);
                const response = await couponService.deleteCoupon(id);
                if (response.success) {
                    setCoupons(coupons.filter(coupon => coupon.id !== id));
                    showToast('Coupon deleted successfully', 'success');
                } else {
                    showToast(response.message || 'Failed to delete coupon', 'error');
                }
            } catch (err) {
                showToast('An error occurred while deleting the coupon', 'error');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Filter coupons based on search term
    const filteredCoupons = coupons.filter(coupon =>
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.discountValue.toString().includes(searchTerm)
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupon Management</h1>
                <Button
                    onClick={() => navigate('/admin/coupons/new')}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Add New Coupon
                </Button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    ID {params.sortBy === 'id' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name {params.sortBy === 'name' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => handleSort('discountValue')}
                                >
                                    Discount {params.sortBy === 'discountValue' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCoupons.length > 0 ? (
                                filteredCoupons.map(coupon => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{coupon.id}</td>
                                        <td className="py-2 px-4 border-b">{coupon.name}</td>
                                        <td className="py-2 px-4 border-b">{coupon.discountValue}%</td>
                                        <td className="py-2 px-4 border-b flex gap-2">
                                            <Button
                                                onClick={() => navigate(`/admin/coupons/${coupon.id}`)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}
                                                className="bg-yellow-600 hover:bg-yellow-700"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 px-4 text-center">
                                        No coupons found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <Button
                            onClick={() => handlePageChange(Math.max(0, params.page! - 1))}
                            disabled={params.page === 0}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                        >
                            Previous
                        </Button>
                        <span>Page {params.page! + 1}</span>
                        <Button
                            onClick={() => handlePageChange(params.page! + 1)}
                            disabled={filteredCoupons.length < params.size!}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CouponListPage;