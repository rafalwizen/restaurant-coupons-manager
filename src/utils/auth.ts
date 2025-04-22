import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

interface JwtPayload {
    sub: string;
    role: string;
    exp: number;
    [key: string]: any;
}

// Store token in localStorage
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated based on token existence and validity
export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        return decoded.exp > currentTime;
    } catch (error) {
        removeToken();
        return false;
    }
};

// Extract user info from token
export const getUserInfo = (): { username: string; role: string } | null => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
            username: decoded.sub,
            role: decoded.role,
        };
    } catch {
        return null;
    }
};

// Check if user has admin role
export const isAdmin = (): boolean => {
    const userInfo = getUserInfo();
    return userInfo?.role === 'ADMIN';
};