import apiClient from '../../../../core/network/api-client';
import { BaseResponse } from '../../../../core/types/api-response';
import { Favorite, FavoriteResponse, FavoritesListResponse } from '../../domain/models/favorite.model';

export class FavoriteRepository {
  async getFavorites(): Promise<BaseResponse<Favorite[]>> {
    return apiClient.get('/favorites');
  }

  async toggleFavorite(productId: string): Promise<BaseResponse<FavoriteResponse>> {
    return apiClient.post(`/favorites/${productId}`);
  }
}

export default FavoriteRepository; 