import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { isLoggedIn, username, logout } = useAuth();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-primary-600">
                                RestoCoupons
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Home
                            </Link>
                            {isLoggedIn && (
                                <Link
                                    to="/dashboard"
                                    className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">Welcome, {username}</span>
                                <Button variant="outline" size="small" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
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
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
            </div>

            {/* Mobile menu, toggle classes based on menu state */}
            <div className="sm:hidden" id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    >
                        Home
                    </Link>
                    {isLoggedIn && (
                        <Link
                            to="/dashboard"
                            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Dashboard
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <div className="px-4 py-2">
                            <div className="text-sm text-gray-700 mb-2">Welcome, {username}</div>
                            <Button variant="outline" size="small" onClick={logout} fullWidth>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="px-4 py-2">
                            <Link to="/login">
                                <Button fullWidth>Sign in</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;