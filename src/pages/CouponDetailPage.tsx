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
    const [isMobile, setIsMobile] = useState(false); // Hook do wykrywania urządzenia mobilnego

    useEffect(() => {
        // Funkcja do sprawdzania, czy urządzenie jest mobilne
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Ustal rozmiar dla urządzeń mobilnych
        };

        checkMobile(); // Sprawdź początkowo
        window.addEventListener('resize', checkMobile); // Zaktualizuj przy zmianie rozmiaru okna

        return () => {
            window.removeEventListener('resize', checkMobile); // Usuń nasłuchiwacz przy odmontowywaniu
        };
    }, []);

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
                    setError(response.message || 'Nie udało się pobrać szczegółów kuponu.');
                }
            } catch (err) {
                setError('Wystąpił błąd podczas pobierania szczegółów kuponu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCouponDetail();
    }, [id]);

    const handleDelete = async () => {
        if (!id || !window.confirm('Czy na pewno chcesz usunąć ten kupon?')) return;

        try {
            setLoading(true);
            const response = await couponService.deleteCoupon(parseInt(id));
            if (response.success) {
                showToast('Kupon został pomyślnie usunięty.', 'success');
                navigate('/admin/coupons');
            } else {
                showToast(response.message || 'Nie udało się usunąć kuponu.', 'error');
            }
        } catch (err) {
            showToast('Wystąpił błąd podczas usuwania kuponu.', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const isStillValid = (validTo: string | undefined) => {
        if (!validTo) return false;
        const now = new Date();
        const endDate = new Date(validTo);
        return endDate > now;
    };

    const formatValidityPeriod = (validFrom: string | undefined, validTo: string | undefined) => {
        if (!validFrom || !validTo) return 'Okres ważności nieznany';

        const endDate = new Date(validTo);
        const now = new Date();

        if (endDate < now) {
            return 'NIEAKTYWNY';
        }

        const startFormatted = formatDate(validFrom);
        const endFormatted = formatDate(validTo);

        return `Ważny od ${startFormatted} do ${endFormatted}`;
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!coupon) return <ErrorDisplay message="Nie znaleziono kuponu." />;

    const valid = isStillValid(coupon.validTo);

    return (
        <div className="bg-gray-100 min-h-screen pb-8">
            {/* Image Header */}
            <div className="relative h-64 md:h-96 w-full">
                {coupon.imageUrl ? (
                    <img
                        src={coupon.imageUrl}
                        alt={coupon.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{coupon.name}</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Back button */}
                <button
                    onClick={() => navigate('/admin/coupons')}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-lg">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{coupon.name}</h1>
                            <div className="bg-primary-700 text-white rounded-lg px-4 py-2 flex flex-col items-center">
                                <span className="text-xl font-bold">{coupon.discountValue}%</span>
                                <span className="text-xs font-medium">OFF</span>
                            </div>
                        </div>

                        {/* Validity */}
                        <div className={`mb-6 px-4 py-2 rounded-lg text-center ${valid ? 'bg-primary-50 bg-primary-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="font-medium">
                                {formatValidityPeriod(coupon.validFrom, coupon.validTo)}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800">Opis</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{coupon.description || 'Brak opisu.'}</p>
                        </div>

                        {/* Validity details */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800">Okres ważności</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Ważny od</p>
                                    <p className="font-semibold">{formatDate(coupon.validFrom)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Ważny do</p>
                                    <p className="font-semibold">{formatDate(coupon.validTo)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Terms and conditions */}
                        {coupon.termsAndConditions && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">Regulamin</h2>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{coupon.termsAndConditions}</p>
                            </div>
                        )}

                        {/* Admin actions */}
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                            <Button onClick={() => navigate('/admin/coupons')}>
                                {isMobile ? 'Powrót' : 'Powrót do listy'}
                            </Button>

                            <div className="flex gap-2">
                                <Button onClick={() => navigate(`/admin/coupons/${id}/edit`)}>
                                    Edytuj
                                </Button>
                                <Button onClick={handleDelete}>
                                    Usuń
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponDetailPage;
