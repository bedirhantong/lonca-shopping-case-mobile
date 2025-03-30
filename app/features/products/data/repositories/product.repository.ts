import apiClient from '../../../../core/network/api-client';
import { BaseResponse } from '../../../../core/types/api-response';
import { Product, ProductFilters, ProductsResponse } from '../../domain/models/product.model';

export class ProductRepository {
  async getProducts(filters: ProductFilters = {}): Promise<BaseResponse<ProductsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.sort_field) queryParams.append('sort_field', filters.sort_field);
    if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);
    if (filters.vendor_name) queryParams.append('vendor_name', filters.vendor_name);
    if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
    if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());

    const queryString = queryParams.toString();
    return apiClient.get(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProductById(id: string): Promise<BaseResponse<Product>> {
    return apiClient.get(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<BaseResponse<Product[]>> {
    return apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

export default ProductRepository; 