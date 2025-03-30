import { BaseResponse } from '../../../../core/types/api-response';
import { ProductRepository } from '../../data/repositories/product.repository';
import { Product, ProductFilters, ProductsResponse } from '../models/product.model';

export class ProductUseCase {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getProducts(filters: ProductFilters = {}): Promise<BaseResponse<ProductsResponse>> {
    try {
      return await this.repository.getProducts(filters);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string): Promise<BaseResponse<Product>> {
    try {
      return await this.repository.getProductById(id);
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(query: string): Promise<BaseResponse<Product[]>> {
    try {
      return await this.repository.searchProducts(query);
    } catch (error) {
      throw error;
    }
  }
}

export default ProductUseCase; 