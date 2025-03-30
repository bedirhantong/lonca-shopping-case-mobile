import apiClient from '../../../../core/network/api-client';
import { BaseResponse } from '../../../../core/types/api-response';
import { Review, ReviewsResponse, CreateReviewRequest, UpdateReviewRequest } from '../../domain/models/review.model';

export class ReviewRepository {
  async getProductReviews(productId: string, page: number = 1, limit: number = 100): Promise<BaseResponse<ReviewsResponse>> {
    return apiClient.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
  }

  async createReview(productId: string, data: CreateReviewRequest): Promise<BaseResponse<Review>> {
    return apiClient.post(`/products/${productId}/reviews`, data);
  }

  async updateReview(reviewId: string, data: UpdateReviewRequest): Promise<BaseResponse<Review>> {
    return apiClient.put(`/reviews/${reviewId}`, data);
  }

  async deleteReview(reviewId: string): Promise<BaseResponse<void>> {
    return apiClient.delete(`/reviews/${reviewId}`);
  }
}

export default ReviewRepository; 