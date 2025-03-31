import { User } from '../../../auth/domain/models/user.model';

export interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ProfileUpdateInput {
  full_name?: string;
  avatar_url?: string;
}

export interface Profile extends User {
  favorites_count?: number;
  reviews_count?: number;
}

export default Profile; 