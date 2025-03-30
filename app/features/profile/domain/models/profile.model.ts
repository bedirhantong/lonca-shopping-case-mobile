import { User } from '../../../auth/domain/models/user.model';

export interface Profile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ProfileUpdateRequest {
  full_name?: string;
  avatar_url?: string;
}

export interface Profile extends User {
  favorites_count?: number;
  reviews_count?: number;
}

export default Profile; 