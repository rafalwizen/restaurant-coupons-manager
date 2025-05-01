import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CouponListParams, CouponSummary } from '../types/coupon.types';
import { couponService } from '../api/couponService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useToast } from '../contexts/ToastContext';

const CouponListPage: React.FC = () => {
    const [coupons, setCoupons] = useState<CouponSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [params, setParams] = useState<CouponListParams>({
        page: 0,
        size: 10,
        sortBy: 'id',
        direction: 'asc'
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

    const navigate = useNavigate();
    const { showToast } = useToast();

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

    const openDeleteDialog = (id: number) => {
        setCouponToDelete(id);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCouponToDelete(null);
    };

    const confirmDelete = async () => {
        if (couponToDelete === null) return;

        try {
            setDeleteLoading(true);
            const response = await couponService.deleteCoupon(couponToDelete);
            if (response.success) {
                setCoupons(coupons.filter(coupon => coupon.id !== couponToDelete));
                showToast('Coupon deleted successfully', 'success');
            } else {
                showToast(response.message || 'Failed to delete coupon', 'error');
            }
        } catch (err) {
            showToast('An error occurred while deleting the coupon', 'error');
            console.error(err);
        } finally {
            setDeleteLoading(false);
            closeDeleteDialog();
        }
    };

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
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex items-center">
                                                {coupon.imageId && (
                                                    <div className="mr-2 w-10 h-10 flex-shrink-0">
                                                        <img
                                                            src={`/api/images/${coupon.imageId}/content`}
                                                            alt={coupon.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {coupon.name}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">{coupon.discountValue}%</td>
                                        <td className="py-2 px-4 border-b flex gap-2">
                                            <Button
                                                onClick={() => navigate(`/admin/coupons/${coupon.id}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => openDeleteDialog(coupon.id)}
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
                        >
                            Previous
                        </Button>
                        <span>Page {params.page! + 1}</span>
                        <Button
                            onClick={() => handlePageChange(params.page! + 1)}
                            disabled={filteredCoupons.length < params.size!}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}

            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={closeDeleteDialog}
                isConfirmLoading={deleteLoading}
            />
        </div>
    );
};

export default CouponListPage;
