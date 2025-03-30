import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FavoriteUseCase } from '../../features/favorites/domain/usecases/favorite.usecase';
import { Favorite, FavoriteResponse } from '../../features/favorites/domain/models/favorite.model';
import { Product } from '../../features/products/domain/models/product.model';
import { BaseResponse } from '../../core/types/api-response';

interface FavoriteState {
  items: Favorite[];
  isLoading: boolean;
  error: string | null;
  pendingToggles: { [key: string]: boolean };
}

const initialState: FavoriteState = {
  items: [],
  isLoading: false,
  error: null,
  pendingToggles: {},
};

const favoriteUseCase = new FavoriteUseCase();

export const fetchFavorites = createAsyncThunk<Favorite[]>(
  'favorites/fetchFavorites',
  async () => {
    const response = await favoriteUseCase.getFavorites();
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch favorites');
    }
    return response.data;
  }
);

export const toggleFavorite = createAsyncThunk<FavoriteResponse, Product>(
  'favorites/toggleFavorite',
  async (product, { rejectWithValue }) => {
    try {
      const response = await favoriteUseCase.toggleFavorite(product.id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to toggle favorite');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle favorite');
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        const productId = action.meta.arg.id;
        state.pendingToggles[productId] = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const productId = action.meta.arg.id;
        delete state.pendingToggles[productId];
        
        if (action.payload.status === 'added') {
          // Favoriye ekleme durumu
          state.items.push({
            id: action.payload.id || 'temp',
            userId: action.payload.user_id || 'temp',
            product: action.meta.arg,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // Favoriden çıkarma durumu
          state.items = state.items.filter(item => item.product.id !== productId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        delete state.pendingToggles[productId];
        state.error = action.payload as string || 'Failed to toggle favorite';
        
        // Hata durumunda güncel listeyi yeniden yükle
        favoriteUseCase.getFavorites().then(response => {
          if (response.success && response.data) {
            state.items = response.data;
          }
        });
      });
  },
});

export default favoriteSlice.reducer; 