import apiClient from '../../../../core/network/api-client';
import { BaseResponse } from '../../../../core/types/api-response';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../domain/models/user.model';

export class AuthRepository {
  async login(data: LoginRequest): Promise<BaseResponse<AuthResponse>> {
    return apiClient.post('/users/login', data);
  }

  async register(data: RegisterRequest): Promise<BaseResponse<AuthResponse>> {
    return apiClient.post('/users/register', data);
  }

  async getCurrentUser(): Promise<BaseResponse<AuthResponse>> {
    return apiClient.get('/users/me');
  }
}

export default AuthRepository; 