import { AuthRepository } from '../../data/repositories/auth.repository';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { BaseResponse } from '../../../../core/types/api-response';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthUseCase {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async login(data: LoginRequest): Promise<BaseResponse<AuthResponse>> {
    try {
      const response = await this.repository.login(data);
      if (response.success) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<BaseResponse<AuthResponse>> {
    try {
      const response = await this.repository.register(data);
      if (response.success) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<BaseResponse<AuthResponse>> {
    try {
      return await this.repository.getCurrentUser();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
  }
}

export default AuthUseCase; 