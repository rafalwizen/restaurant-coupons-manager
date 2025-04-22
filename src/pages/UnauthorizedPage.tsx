import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full text-center">
                <div className="text-red-500 text-6xl mb-6">403</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                </p>
                <Link to="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;