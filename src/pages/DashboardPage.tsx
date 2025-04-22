// src/pages/DashboardPage.tsx
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const DashboardPage = () => {
    const { username, logout } = useAuth();

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center">
                        <span className="mr-4 text-gray-600">Welcome, {username}</span>
                        <Button variant="outline" size="small" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                    <p className="text-gray-600 mb-4">
                        Welcome to the Restaurant Coupon Manager. This is a placeholder dashboard
                        that will be expanded with coupon management features in the future.
                    </p>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium mb-3">What's Next?</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Coupon creation and management</li>
                            <li>Usage analytics and reporting</li>
                            <li>Customer engagement tracking</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;