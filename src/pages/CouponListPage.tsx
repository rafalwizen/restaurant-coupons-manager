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
                    setError(response.message || 'Nie udało się pobrać listy kuponów.');
                }
            } catch (err) {
                setError('Wystąpił błąd podczas pobierania kuponów.');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Zarządzanie kuponami</h1>
                <Button onClick={() => navigate('/admin/coupons/new')}>
                    Dodaj nowy kupon
                </Button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Szukaj kuponów..."
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
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('id')}>
                                    ID {params.sortBy === 'id' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('name')}>
                                    Nazwa {params.sortBy === 'name' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('discountValue')}>
                                    Rabat {params.sortBy === 'discountValue' && (params.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-2 px-4 border-b">Akcje</th>
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
                                            <Button onClick={() => navigate(`/admin/coupons/${coupon.id}`)}>
                                                Podgląd
                                            </Button>
                                            <Button onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}>
                                                Edytuj
                                            </Button>
                                            <Button onClick={() => openDeleteDialog(coupon.id)}>
                                                Usuń
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 px-4 text-center">
                                        Nie znaleziono kuponów.
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
                            Poprzednia
                        </Button>
                        <span>Strona {params.page! + 1}</span>
                        <Button
                            onClick={() => handlePageChange(params.page! + 1)}
                            disabled={filteredCoupons.length < params.size!}
                        >
                            Następna
                        </Button>
                    </div>
                </>
            )}

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
