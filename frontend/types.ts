export type Role = 'USER' | 'AGENT' | 'ADMIN';

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  agencyName?: string;
  createdAt?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  agencyName?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface ListingResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  floor?: string;
  type: 'SALE' | 'RENT';
  status: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'EXPIRED';
  category: string;
  city: string;
  district?: string;
  primaryImage?: string;
  images: string[];
  createdAt: string;
  user?: UserResponse;
}

export interface ListingFilters {
  categoryId?: number;
  locationId?: number;
  type?: 'SALE' | 'RENT';
  priceMin?: number;
  priceMax?: number;
  minArea?: number;
  maxArea?: number;
  minRooms?: number;
  maxRooms?: number;
}
