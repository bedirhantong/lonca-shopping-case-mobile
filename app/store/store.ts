import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './features/favoriteSlice';
import profileReducer from './features/profileSlice';

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 