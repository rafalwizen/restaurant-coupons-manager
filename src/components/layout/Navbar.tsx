import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Kupony Restauracyjne</Link>

                <div className="hidden sm:flex items-center space-x-4">
                    <Link to="/" className="hover:text-secondary">Strona główna</Link>

                    {isLoggedIn && user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin/coupons" className="hover:text-secondary">Zarządzaj kuponami</Link>
                                    <Link to="/admin/images" className="hover:text-secondary">Zarządzaj obrazami</Link>
                                </>
                            )}

                            <div className="flex items-center space-x-4">
                                <span className="text-sm">Witaj, {user.username}</span>
                                <Button onClick={handleLogout}>Wyloguj</Button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button>Zaloguj się</Button>
                        </Link>
                    )}
                </div>

                {/* Przycisk menu mobilnego */}
                <div className="flex items-center sm:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-muted-text hover:text-white hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Otwórz menu główne</span>
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Menu mobilne */}
            <div className="sm:hidden" id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                    >
                        Strona główna
                    </Link>

                    {isLoggedIn && user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link
                                        to="/admin/coupons"
                                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                                    >
                                        Zarządzaj kuponami
                                    </Link>
                                    <Link
                                        to="/admin/images"
                                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                                    >
                                        Zarządzaj obrazami
                                    </Link>
                                </>
                            )}

                            <div className="px-4 py-2">
                                <div className="text-sm text-muted-text mb-2">Witaj, {user.username}</div>
                                <Button onClick={handleLogout}>Wyloguj</Button>
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-2">
                            <Link to="/login">
                                <Button className="w-full">Zaloguj się</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;