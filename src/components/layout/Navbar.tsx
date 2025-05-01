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
                <Link to="/" className="text-xl font-bold">Restaurant Coupons</Link>

                <div className="hidden sm:flex items-center space-x-4">
                    <Link to="/" className="hover:text-secondary">Home</Link>

                    {isLoggedIn && user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin/coupons" className="hover:text-secondary">Manage Coupons</Link>
                                    <Link to="/admin/images" className="hover:text-secondary">Manage Images</Link>
                                </>
                            )}

                            <div className="flex items-center space-x-4">
                                <span className="text-sm">Welcome, {user.username}</span>
                                <Button
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button>Sign in</Button>
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-muted-text hover:text-white hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
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

            {/* Mobile menu */}
            <div className="sm:hidden" id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                    >
                        Home
                    </Link>

                    {isLoggedIn && user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link
                                        to="/admin/coupons"
                                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                                    >
                                        Manage Coupons
                                    </Link>
                                    <Link
                                        to="/admin/images"
                                        className="border-transparent text-muted-text hover:bg-primary-800 block pl-3 pr-4 py-2 text-base font-medium"
                                    >
                                        Manage Images
                                    </Link>
                                </>
                            )}

                            <div className="px-4 py-2">
                                <div className="text-sm text-muted-text mb-2">Welcome, {user.username}</div>
                                <Button
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-2">
                            <Link to="/login">
                                <Button className="w-full">Sign in</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;