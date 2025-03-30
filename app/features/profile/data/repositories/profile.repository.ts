import apiClient from '../../../../core/network/api-client';
import { BaseResponse } from '../../../../core/types/api-response';
import { Profile, ProfileUpdateRequest } from '../../domain/models/profile.model';

export class ProfileRepository {
  async getProfile(): Promise<BaseResponse<Profile>> {
    return apiClient.get('/users/me');
  }

  async updateProfile(userId: string, data: ProfileUpdateRequest): Promise<BaseResponse<Profile>> {
    return apiClient.put(`/users/${userId}`, data);
  }
}

export default ProfileRepository; 