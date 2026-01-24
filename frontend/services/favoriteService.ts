import api from './api';
import { ListingResponse } from '../types';

export const favoriteService = {
    /**
     * Get all favorited listings for the authenticated user
     */
    async getFavorites(): Promise<ListingResponse[]> {
        const response = await api.get('/favorites');
        return response.data;
    },

    /**
     * Add a listing to favorites
     */
    async addFavorite(listingId: number): Promise<void> {
        await api.post(`/favorites/${listingId}`);
    },

    /**
     * Remove a listing from favorites
     */
    async removeFavorite(listingId: number): Promise<void> {
        await api.delete(`/favorites/${listingId}`);
    },

    /**
     * Toggle favorite status for a listing
     */
    async toggleFavorite(listingId: number, isFavorite: boolean): Promise<void> {
        if (isFavorite) {
            await this.removeFavorite(listingId);
        } else {
            await this.addFavorite(listingId);
        }
    },
};
