import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    // Zamknij menu po kliknięciu poza nim
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('button[data-menu-toggle]')
            ) {
                setMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="bg-primary-700 text-white shadow-md relative z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Kupony Restauracyjne</Link>

                {/* Menu desktop */}
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
                        data-menu-toggle="true"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-muted-text hover:text-white hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">{isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}</span>
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMobileMenuOpen
                                        ? 'M6 18L18 6M6 6l12 12' // ikona X
                                        : 'M4 6h16M4 12h16M4 18h16' // ikona hamburgera
                                }
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Menu mobilne z animacją */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="sm:hidden overflow-hidden bg-primary-700"
                        ref={menuRef}
                    >
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-primary-800"
                            >
                                Strona główna
                            </Link>

                            {isLoggedIn && user ? (
                                <>
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <Link
                                                to="/admin/coupons"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-primary-800"
                                            >
                                                Zarządzaj kuponami
                                            </Link>
                                            <Link
                                                to="/admin/images"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-primary-800"
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
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full">Zaloguj się</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
