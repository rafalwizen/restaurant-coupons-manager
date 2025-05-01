import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full text-center">
                <div className="text-red-500 text-6xl mb-6">403</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Dostęp zabroniony</h1>
                <p className="text-gray-600 mb-8">
                    Nie masz uprawnień do dostępu do tej strony. Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
                </p>
                <Link to="/home">
                    <Button>Powrót</Button>
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
