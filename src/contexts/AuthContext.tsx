import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest } from '../types/api.types';
import { authApi, apiClient } from '../api/apiClient';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from stored token
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('authToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser) as User;
                    setUser(parsedUser);
                    setIsLoggedIn(true);

                    // Set auth token in axios default headers
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (err) {
                    console.error('Error parsing saved user:', err);
                    // Clear invalid data
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await authApi.login(credentials);

        if (response.success && response.data) {
            const { token, username, role } = response.data;
            const userData = { username, role };

            // Save to localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsLoggedIn(true);

            // Set auth token in axios default headers
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Update state
        setUser(null);
        setIsLoggedIn(false);

        // Remove auth token from axios default headers
        delete apiClient.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};