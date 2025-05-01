import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const HomePage = () => {
    const { isLoggedIn } = useAuth();

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Menedżer Kuponów Restauracyjnych
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Jest to tylko przykładowa strona główna, można tutaj dodać co tylko będzie potrzeba... jakieś śledzenie kuponów, statystyki itp...
                    </p>
                    <div className="mt-8 flex justify-center">
                        {isLoggedIn ? (
                            <Link to="/admin/coupons">
                                <Button size="large">Zarządzaj kuponami</Button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button size="large">Zaloguj się</Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900">Funkcje</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Twórz kupony</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Twórz i edytuj kupony rabatowe.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Śledź użycie (nie zaimplementowane)</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Monitoruj użycie kuponów i ich efektywność.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
