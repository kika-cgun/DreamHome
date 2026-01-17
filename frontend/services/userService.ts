import api from './api';
import { UserResponse, UserUpdateRequest } from '../types';

export const userService = {
    /**
     * Get current authenticated user data
     */
    async getCurrentUser(): Promise<UserResponse> {
        const response = await api.get<UserResponse>('/users/me');
        return response.data;
    },

    /**
     * Update current user profile
     */
    async updateCurrentUser(data: UserUpdateRequest): Promise<UserResponse> {
        const response = await api.put<UserResponse>('/users/me', data);
        return response.data;
    },

    /**
     * Get all users (ADMIN only)
     */
    async getAllUsers(): Promise<UserResponse[]> {
        const response = await api.get<UserResponse[]>('/users');
        return response.data;
    },
};
