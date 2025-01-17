'use client';

import { UserDto } from '@/interfaces/user/dto/UserDto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  user?: UserDto | null;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: UserDto }>) {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    register(state, action: PayloadAction<{ user: UserDto }>) {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
