import { ApiResponse } from '../types/api.types';
import { ImageDetail, ImageSummary } from '../types/image.types';
import { apiRequest } from './apiClient';

export const imageService = {
    /**
     * Get all images
     */
    getAllImages: async (): Promise<ApiResponse<ImageSummary[]>> => {
        return apiRequest<ImageSummary[]>({
            method: 'GET',
            url: '/images',
        });
    },

    /**
     * Get image metadata by ID
     */
    getImageById: async (id: number): Promise<ApiResponse<ImageDetail>> => {
        return apiRequest<ImageDetail>({
            method: 'GET',
            url: `/images/${id}`,
        });
    },

    /**
     * Upload a new image
     */
    uploadImage: async (file: File, description?: string): Promise<ApiResponse<ImageDetail>> => {
        const formData = new FormData();
        formData.append('file', file);

        if (description) {
            formData.append('description', description);
        }

        return apiRequest<ImageDetail>({
            method: 'POST',
            url: '/images',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Delete an image
     */
    deleteImage: async (id: number): Promise<ApiResponse<void>> => {
        return apiRequest<void>({
            method: 'DELETE',
            url: `/images/${id}`,
        });
    },

    /**
     * Get direct URL to display an image
     */
    getImageUrl: (id: number): string => {
        // Using the baseURL from apiClient
        return `${apiRequest.getBaseUrl()}/images/${id}/content`;
    },
};