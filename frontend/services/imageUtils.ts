import { useConfigStore } from '../stores/configStore';

/**
 * Helper function to convert relative image paths to full URLs.
 * If the URL is already a full URL (http/https), it returns as-is.
 * Relative paths (like /storage/uploads/...) are converted to full URLs
 * using the current backend API URL.
 */
export const getImageUrl = (url: string | null | undefined, apiBaseUrl?: string): string | null => {
    if (!url) return null;

    // If it's already a full URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Get API URL from store if not provided
    const baseApiUrl = apiBaseUrl || useConfigStore.getState().getApiUrl();

    // Convert relative path to full URL (remove /api suffix from base URL)
    const baseUrl = baseApiUrl.replace(/\/api$/, '');
    return `${baseUrl}${url}`;
};

/**
 * React hook to get an image URL converter that uses the current backend config.
 */
export const useImageUrl = () => {
    const apiUrl = useConfigStore((state) => state.getApiUrl());

    return (url: string | null | undefined): string | null => {
        return getImageUrl(url, apiUrl);
    };
};
