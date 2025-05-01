import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full text-center">
                <div className="text-gray-400 text-6xl mb-6">404</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Strona nie została znaleziona</h1>
                <p className="text-gray-600 mb-8">
                    Strona, którą szukasz, nie istnieje lub została przeniesiona.
                </p>
                <Link to="/">
                    <Button>Wróć do strony głównej</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
