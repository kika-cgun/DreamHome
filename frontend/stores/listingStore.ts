import { create } from 'zustand';
import { ListingResponse, ListingFilters } from '../types';

interface ListingState {
    listings: ListingResponse[];
    currentListing: ListingResponse | null;
    filters: ListingFilters;
    favoriteIds: Set<number>;
    favorites: ListingResponse[];
    isLoading: boolean;

    // Actions
    setListings: (listings: ListingResponse[]) => void;
    setCurrentListing: (listing: ListingResponse | null) => void;
    setFilters: (filters: ListingFilters) => void;
    addFavorite: (listingId: number) => void;
    removeFavorite: (listingId: number) => void;
    setFavorites: (favorites: ListingResponse[]) => void;
    isFavorite: (listingId: number) => boolean;
    setLoading: (isLoading: boolean) => void;
}

export const useListingStore = create<ListingState>((set, get) => ({
    listings: [],
    currentListing: null,
    filters: {},
    favoriteIds: new Set(),
    favorites: [],
    isLoading: false,

    setListings: (listings) => set({ listings }),

    setCurrentListing: (listing) => set({ currentListing: listing }),

    setFilters: (filters) => set({ filters }),

    addFavorite: (listingId) => set((state) => {
        const newFavorites = new Set(state.favoriteIds);
        newFavorites.add(listingId);
        return { favoriteIds: newFavorites };
    }),

    removeFavorite: (listingId) => set((state) => {
        const newFavorites = new Set(state.favoriteIds);
        newFavorites.delete(listingId);
        return {
            favoriteIds: newFavorites,
            favorites: state.favorites.filter(f => f.id !== listingId)
        };
    }),

    setFavorites: (favorites) => set({
        favorites: favorites,
        favoriteIds: new Set(favorites.map(f => f.id))
    }),

    isFavorite: (listingId) => get().favoriteIds.has(listingId),

    setLoading: (isLoading) => set({ isLoading }),
}));
