import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './features/favoriteSlice';
import profileReducer from './features/profileSlice';
import searchReducer from './features/searchSlice';

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    profile: profileReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 