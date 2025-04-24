export interface CouponSummary {
    id: number;
    name: string;
    discountValue: number;
}

export interface CouponDetail {
    id: number;
    name: string;
    description: string;
    discountValue: number;
    validFrom: string;
    validTo: string;
    termsAndConditions: string;
    isActive: boolean;
}

export interface CouponCreate {
    name: string;
    description?: string;
    discountValue: number;
    validFrom: string;
    validTo: string;
    termsAndConditions?: string;
    isActive?: boolean;
}

export interface CouponUpdate {
    name?: string;
    description?: string;
    discountValue?: number;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
    isActive?: boolean;
}

export interface CouponListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}