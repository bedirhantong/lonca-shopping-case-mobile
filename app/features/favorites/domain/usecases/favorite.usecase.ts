import { BaseResponse } from '../../../../core/types/api-response';
import { FavoriteRepository } from '../../data/repositories/favorite.repository';
import { Favorite, FavoriteResponse } from '../models/favorite.model';

export class FavoriteUseCase {
  private repository: FavoriteRepository;

  constructor() {
    this.repository = new FavoriteRepository();
  }

  async getFavorites(): Promise<BaseResponse<Favorite[]>> {
    try {
      return await this.repository.getFavorites();
    } catch (error) {
      throw error;
    }
  }

  async toggleFavorite(productId: string): Promise<BaseResponse<FavoriteResponse>> {
    try {
      return await this.repository.toggleFavorite(productId);
    } catch (error) {
      throw error;
    }
  }
}

export default FavoriteUseCase; 