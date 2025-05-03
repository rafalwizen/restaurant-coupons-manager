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
    const [refreshing, setRefreshing] = useState(false);

    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchCoupons();
    }, [params]);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await couponService.getCoupons(params);
            if (response.success) {
                setCoupons(response.data as CouponSummary[]);
            } else {
                setError(response.message || 'Nie udało się pobrać listy kuponów.');
            }
        } catch (err) {
            setError('Wystąpił błąd podczas pobierania kuponów.');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCoupons();
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
                showToast('Kupon został usunięty.', 'success');
            } else {
                showToast(response.message || 'Nie udało się usunąć kuponu.', 'error');
            }
        } catch (err) {
            showToast('Wystąpił błąd podczas usuwania kuponu.', 'error');
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

    if (loading && !refreshing) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-8">
            <div className="container mx-auto px-4 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Zarządzanie kuponami</h1>
                    <Button onClick={() => navigate('/admin/coupons/new')}>
                        Dodaj nowy kupon
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Szukaj kuponów..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                </div>

                {filteredCoupons.length === 0 && !loading ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">Nie znaleziono kuponów.</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 text-blue-600 font-medium flex items-center justify-center mx-auto"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Odśwież
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoupons.map(coupon => (
                            <div key={coupon.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                                {coupon.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={coupon.imageUrl}
                                            alt={coupon.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{coupon.name}</h2>
                                        <div className="bg-primary-700 text-white font-bold rounded-md px-3 py-1 text-sm flex flex-col items-center">
                                            <span className="text-lg">{coupon.discountValue}%</span>
                                            <span className="text-xs">OFF</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <Button
                                            onClick={() => navigate(`/admin/coupons/${coupon.id}`)}
                                        >
                                            Szczegóły
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}
                                            >
                                                Edytuj
                                            </Button>
                                            <Button
                                                onClick={() => openDeleteDialog(coupon.id)}
                                            >
                                                Usuń
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <div className="inline-flex rounded-md shadow-sm">
                        <Button
                            onClick={() => handlePageChange(Math.max(0, params.page! - 1))}
                            disabled={params.page === 0}
                        >
                            Poprzednia
                        </Button>
                        <div className="px-4 py-2 text-sm font-medium text-primary-500 bg-primary-50 border-t border-b border-gray-300">
                            Strona {params.page! + 1}
                        </div>
                        <Button
                            onClick={() => handlePageChange(params.page! + 1)}
                            disabled={filteredCoupons.length < params.size!}
                        >
                            Następna
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                title="Usuń kupon"
                message="Czy na pewno chcesz usunąć ten kupon? Tej operacji nie można cofnąć."
                confirmLabel="Usuń"
                cancelLabel="Anuluj"
                onConfirm={confirmDelete}
                onCancel={closeDeleteDialog}
                isConfirmLoading={deleteLoading}
            />
        </div>
    );
};

export default CouponListPage;