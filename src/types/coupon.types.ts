export interface CouponSummary {
    id: number;
    name: string;
    discountValue: number;
    imageId?: number;
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
    imageId?: number;
    imageUrl?: string;
}

export interface CouponCreate {
    name: string;
    description?: string;
    discountValue: number;
    validFrom: string;
    validTo: string;
    termsAndConditions?: string;
    isActive?: boolean;
    imageId?: number;
}

export interface CouponUpdate {
    name?: string;
    description?: string;
    discountValue?: number;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
    isActive?: boolean;
    imageId?: number | null;
}

export interface CouponListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}