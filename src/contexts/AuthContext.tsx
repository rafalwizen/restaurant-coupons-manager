import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setToken, removeToken, isAuthenticated, getUserInfo } from '../utils/auth';
import { authApi } from '../api/apiClient';
import { LoginRequestDto } from '../types/api.types';

interface AuthContextType {
    isLoggedIn: boolean;
    username: string | null;
    userRole: string | null;
    login: (credentials: LoginRequestDto) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    username: null,
    userRole: null,
    login: async () => {},
    logout: () => {},
    loading: true,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from stored token
    useEffect(() => {
        const initAuth = () => {
            const authenticated = isAuthenticated();
            setIsLoggedIn(authenticated);

            if (authenticated) {
                const userInfo = getUserInfo();
                setUsername(userInfo?.username || null);
                setUserRole(userInfo?.role || null);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequestDto) => {
        const response = await authApi.login(credentials);

        if (response.success && response.data) {
            setToken(response.data.token);
            setIsLoggedIn(true);
            setUsername(response.data.username);
            setUserRole(response.data.role);
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const logout = () => {
        removeToken();
        setIsLoggedIn(false);
        setUsername(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                username,
                userRole,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);