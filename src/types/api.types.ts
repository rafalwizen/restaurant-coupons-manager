// API response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

// Auth DTOs
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
}

export interface User {
    username: string;
    role: string;
}

// Coupon DTOs
export interface CouponSummaryDto {
    id: number;
    name: string;
    discountValue: number;
}

export interface CouponDetailDto {
    id: number;
    name: string;
    description: string;
    discountValue: number;
    validFrom: string;
    validTo: string;
    termsAndConditions: string;
    isActive: boolean;
}

export interface CouponCreateDto {
    name: string;
    description?: string;
    discountValue: number;
    validFrom: string;
    validTo: string;
    termsAndConditions?: string;
    isActive?: boolean;
}

export interface CouponUpdateDto {
    name?: string;
    description?: string;
    discountValue?: number;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
    isActive?: boolean;
}

// Pagination options
export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}