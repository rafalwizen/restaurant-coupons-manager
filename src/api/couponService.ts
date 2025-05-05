import { CouponCreate, CouponDetail, CouponListParams, CouponSummary, CouponUpdate } from '../types/coupon.types';
import { ApiResponse } from '../types/api.types';
import { apiRequest } from './apiClient';

export const couponService = {
    /**
     * Get paginated list of coupons
     */
    getCoupons: async (params: CouponListParams = {}): Promise<ApiResponse<CouponSummary[]>> => {
        const { page = 0, size = 10, sortBy = 'id', direction = 'asc' } = params;
        const response = await apiRequest<any>({
            method: 'GET',
            url: '/admin/coupons',
            params: { page, size, sortBy, direction },
        });

        return {
            ...response,
            data: response.data.content,
        };
    },

    /**
     * Get coupon details by ID
     */
    getCouponById: async (id: number): Promise<ApiResponse<CouponDetail>> => {
        return apiRequest<CouponDetail>({
            method: 'GET',
            url: `/admin/coupons/${id}`,
        });
    },

    /**
     * Create a new coupon
     */
    createCoupon: async (coupon: CouponCreate): Promise<ApiResponse<CouponDetail>> => {
        return apiRequest<CouponDetail>({
            method: 'POST',
            url: '/admin/coupons',
            data: coupon,
        });
    },

    /**
     * Update an existing coupon
     */
    updateCoupon: async (id: number, coupon: CouponUpdate): Promise<ApiResponse<CouponDetail>> => {
        return apiRequest<CouponDetail>({
            method: 'PUT',
            url: `/admin/coupons/${id}`,
            data: coupon,
        });
    },

    /**
     * Delete a coupon
     */
    deleteCoupon: async (id: number): Promise<ApiResponse<void>> => {
        return apiRequest<void>({
            method: 'DELETE',
            url: `/admin/coupons/${id}`,
        });
    },
};
