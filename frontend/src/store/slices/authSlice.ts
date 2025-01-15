import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  id: number | null;
  username: string | null;
  email: string | null;
  roles: string[];
  isAuthenticated: boolean;
};

const initialState: UserState = {
  id: null,
  username: null,
  email: null,
  roles: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ id: number; username: string; email: string; roles: string[] }>) {
      const { id, username, email, roles } = action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
      state.roles = roles;
      state.isAuthenticated = true;
    },
    register(state, action: PayloadAction<{ id: number; username: string; email: string; roles: string[] }>) {
      const { id, username, email, roles } = action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
      state.roles = roles;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.id = null;
      state.username = null;
      state.email = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
    updateProfile(state, action: PayloadAction<{ username?: string; email?: string; bio?: string; photo?: string }>) {
      const { username, email } = action.payload;
      if (username) state.username = username;
      if (email) state.email = email;
    },
  },
});

export const { login, register, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
