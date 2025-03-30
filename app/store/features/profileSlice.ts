import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileUseCase } from '../../features/profile/domain/usecases/profile.usecase';
import { Profile } from '../../features/profile/domain/models/profile.model';

interface ProfileState {
  data: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

const profileUseCase = new ProfileUseCase();

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await profileUseCase.getProfile();
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, data }: { userId: string; data: any }) => {
    const response = await profileUseCase.updateProfile(userId, data);
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export default profileSlice.reducer; 