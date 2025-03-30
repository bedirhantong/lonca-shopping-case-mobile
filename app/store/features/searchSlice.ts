import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductUseCase } from '../../features/products/domain/usecases/product.usecase';
import { Product } from '../../features/products/domain/models/product.model';

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
};

const productUseCase = new ProductUseCase();

export const searchProducts = createAsyncThunk<Product[], string>(
  'search/searchProducts',
  async (query) => {
    if (!query.trim()) {
      return [];
    }
    const response = await productUseCase.searchProducts(query);
    if (!response.success) {
      throw new Error(response.message || 'Failed to search products');
    }
    return response.data;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to search products';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 