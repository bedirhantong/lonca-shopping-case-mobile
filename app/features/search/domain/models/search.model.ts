import { Product } from '../../../products/domain/models/product.model';

export interface SearchFilters {
  vendor_name?: string;
  min_price?: number;
  max_price?: number;
  sort_field?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Product[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchResponse {
  items: Product[];
  total: number;
  hasNextPage: boolean;
} 