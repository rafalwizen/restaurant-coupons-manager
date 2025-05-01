import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';

interface LocationState {
    from?: {
        pathname: string;
    };
}

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as LocationState;
    const from = locationState?.from?.pathname || '/';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Nazwa użytkownika i hasło są wymagane');
            return;
        }

        try {
            setLoading(true);
            await login({ username, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logowanie nie powiodło się. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-primary-700">Zarządzanie Kuponami Restauracyjnymi</h1>
                    <p className="mt-2 text-gray-600">Zaloguj się, aby uzyskać dostęp do swojego konta</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Nazwa użytkownika"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Wprowadź nazwę użytkownika"
                            required
                        />

                        <FormInput
                            label="Hasło"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wprowadź swoje hasło"
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={loading}
                            className="mt-4"
                        >
                            Zaloguj się
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
