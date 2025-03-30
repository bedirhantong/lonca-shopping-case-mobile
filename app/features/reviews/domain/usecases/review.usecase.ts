import { BaseResponse } from '../../../../core/types/api-response';
import { ReviewRepository } from '../../data/repositories/review.repository';
import { Review, ReviewsResponse, CreateReviewRequest, UpdateReviewRequest } from '../models/review.model';

export class ReviewUseCase {
  private repository: ReviewRepository;

  constructor() {
    this.repository = new ReviewRepository();
  }

  async getProductReviews(productId: string, page: number = 1, limit: number = 100): Promise<BaseResponse<ReviewsResponse>> {
    try {
      return await this.repository.getProductReviews(productId, page, limit);
    } catch (error) {
      throw error;
    }
  }

  async createReview(productId: string, data: CreateReviewRequest): Promise<BaseResponse<Review>> {
    try {
      return await this.repository.createReview(productId, data);
    } catch (error) {
      throw error;
    }
  }

  async updateReview(reviewId: string, data: UpdateReviewRequest): Promise<BaseResponse<Review>> {
    try {
      return await this.repository.updateReview(reviewId, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(reviewId: string): Promise<BaseResponse<void>> {
    try {
      return await this.repository.deleteReview(reviewId);
    } catch (error) {
      throw error;
    }
  }
}

export default ReviewUseCase; 