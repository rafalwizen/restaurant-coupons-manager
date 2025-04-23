import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, LoginRequestDto, LoginResponseDto } from '../types/api.types';
import { getToken, removeToken } from '../utils/auth';
import env from '../config/env';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: env.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle token expiration
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Generic API request handler with proper typing
export const apiRequest = async <T>(
    config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance(config);
        return response.data as ApiResponse<T>;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
        throw error;
    }
};

// Auth API
export const authApi = {
    login: async (credentials: LoginRequestDto): Promise<ApiResponse<LoginResponseDto>> => {
        return apiRequest<LoginResponseDto>({
            method: 'POST',
            url: '/auth/login',
            data: credentials,
        });
    },
};

// Public Coupon API (not implemented yet, just API structure)
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

// Admin Coupon API (not implemented yet, just API structure)
export const adminCouponApi = {
    // Will implement when needed
};