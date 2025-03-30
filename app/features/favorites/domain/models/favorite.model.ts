import { Product } from '../../../products/domain/models/product.model';

export interface Favorite {
  id: string;
  userId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteResponse {
  status: "added" | "removed";
  id?: string;
  user_id?: string;
  product_id?: string;
  message?: string;
}

export interface FavoritesListResponse {
  items: Favorite[];
  message?: string;
}

export default Favorite; 