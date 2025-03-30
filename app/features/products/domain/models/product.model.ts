export interface Product {
  id: string;
  name: string;
  vendor_name: string;
  series_name: string;
  item_quantity: number;
  description: string;
  main_image: string;
  price: number;
  images: string[];
  product_code: string;
}

export interface ProductsResponse {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_order?: string;
  vendor_name?: string;
  min_price?: number;
  max_price?: number;
}

export default Product; 