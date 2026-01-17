import api from './api';
import { ListingResponse, ListingFilters } from '../types';

export const listingService = {
  /**
   * Fetch all listings with optional filters
   */
  async fetchListings(filters?: ListingFilters): Promise<ListingResponse[]> {
    const response = await api.get('/listings', { params: filters });
    return response.data;
  },

  /**
   * Fetch a single listing by ID
   */
  async fetchListing(id: number): Promise<ListingResponse> {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  /**
   * Create a new listing (requires AGENT or ADMIN role)
   */
  async createListing(data: any): Promise<ListingResponse> {
    const response = await api.post('/listings', data);
    return response.data;
  },

  /**
   * Update an existing listing (requires ownership or ADMIN role)
   */
  async updateListing(id: number, data: any): Promise<ListingResponse> {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  /**
   * Delete a listing (requires ownership or ADMIN role)
   */
  async deleteListing(id: number): Promise<void> {
    await api.delete(`/listings/${id}`);
  },

  /**
   * Get current user's listings (AGENT or ADMIN only)
   */
  async getMyListings(): Promise<ListingResponse[]> {
    const response = await api.get<ListingResponse[]>('/listings/my');
    return response.data;
  },
};
