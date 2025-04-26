import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, LoginRequest, LoginResponse } from '../types/api.types';
import env from '../config/env';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: env.API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle token expiration
        if (error.response?.status === 401) {
            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Only redirect if we're not already on the login page
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Get base URL (added method)
const getBaseUrl = (): string => {
    return env.API_URL || 'http://localhost:8080/api';
};

// Generic API request handler with proper typing
export const apiRequest = async <T>(
    config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient(config);
        return response.data as ApiResponse<T>;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
        throw error;
    }
};

// Add the getBaseUrl method to apiRequest
apiRequest.getBaseUrl = getBaseUrl;

// Auth API
export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return apiRequest<LoginResponse>({
            method: 'POST',
            url: '/auth/login',
            data: credentials,
        });
    },
};

// Public Coupon API
export const couponApi = {
    getAllCoupons: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        return apiRequest({
            method: 'GET',
            url: '/coupons',
            params: { page, size, sortBy, direction },
        });
    },

    getCouponById: async (id: number) => {
        return apiRequest({
            method: 'GET',
            url: `/coupons/${id}`,
        });
    },
};

export { apiClient };