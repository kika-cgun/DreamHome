import api from './api';

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Location {
    id: number;
    city: string;
    district?: string;
    postalCode?: string;
}

export const categoryService = {
    /**
     * Fetch all categories
     */
    async getCategories(): Promise<Category[]> {
        const response = await api.get('/categories');
        return response.data;
    },

    /**
     * Fetch all locations
     */
    async getLocations(): Promise<Location[]> {
        const response = await api.get('/locations');
        return response.data;
    },

    /**
     * Create a new category (ADMIN only)
     */
    async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
        const response = await api.post('/categories', data);
        return response.data;
    },

    /**
     * Create a new location (ADMIN only)
     */
    async createLocation(data: Omit<Location, 'id'>): Promise<Location> {
        const response = await api.post('/locations', data);
        return response.data;
    },
};
