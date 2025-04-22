// API response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
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

// Auth DTOs
export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    username: string;
    role: string;
}

// Pagination options
export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}