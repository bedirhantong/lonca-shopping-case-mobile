import { Profile, ProfileUpdateInput } from '../models/profile.model';
import { BaseResponse } from '../../../../core/types/api-response';
import apiClient from '../../../../core/network/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ProfileUseCase {
  async getProfile(): Promise<BaseResponse<Profile>> {
    try {
      return await apiClient.get('/users/me');
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(data: ProfileUpdateInput): Promise<BaseResponse<Profile>> {
    try {
      return await apiClient.put('/users/me', data);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
  }
} 