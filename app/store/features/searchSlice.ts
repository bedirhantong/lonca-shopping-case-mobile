import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductUseCase } from '../../features/products/domain/usecases/product.usecase';
import { Product } from '../../features/products/domain/models/product.model';
import { SearchFilters, SearchState } from '../../features/search/domain/models/search.model';

const initialState: SearchState = {
  query: '',
  filters: {
    sort_field: 'name',
    sort_order: 'asc'
  },
  results: [],
  isLoading: false,
  error: null,
};

const productUseCase = new ProductUseCase();

export const searchProducts = createAsyncThunk<Product[], { query: string; filters: SearchFilters }>(
  'search/searchProducts',
  async ({ query, filters }) => {
    if (!query.trim()) {
      return [];
    }
    const response = await productUseCase.searchProducts(query, filters);
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
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

export const { setQuery, setFilters, clearSearch, clearFilters } = searchSlice.actions;
export default searchSlice.reducer; 