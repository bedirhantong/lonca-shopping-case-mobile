import { BaseResponse } from '../../../../core/types/api-response';
import { ProfileRepository } from '../../data/repositories/profile.repository';
import { Profile, ProfileUpdateRequest } from '../models/profile.model';

export class ProfileUseCase {
  private repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  async getProfile(): Promise<BaseResponse<Profile>> {
    try {
      return await this.repository.getProfile();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, data: ProfileUpdateRequest): Promise<BaseResponse<Profile>> {
    try {
      return await this.repository.updateProfile(userId, data);
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileUseCase; 