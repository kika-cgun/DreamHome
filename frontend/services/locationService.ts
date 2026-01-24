import api from './api';

export interface Location {
    id: number;
    city: string;
    district?: string;
    postalCode?: string;
}

export const locationService = {
    /**
     * Fetch all locations
     */
    async getAllLocations(): Promise<Location[]> {
        const response = await api.get('/locations');
        return response.data;
    },

    /**
     * Create a new location (ADMIN only)
     */
    async createLocation(data: Omit<Location, 'id'>): Promise<Location> {
        const response = await api.post('/locations', data);
        return response.data;
    },

    /**
     * Update a location (ADMIN only)
     */
    async updateLocation(id: number, data: Partial<Omit<Location, 'id'>>): Promise<Location> {
        const response = await api.put(`/locations/${id}`, data);
        return response.data;
    },

    /**
     * Delete a location (ADMIN only)
     */
    async deleteLocation(id: number): Promise<void> {
        await api.delete(`/locations/${id}`);
    },
};
