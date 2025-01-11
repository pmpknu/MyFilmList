import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
    isAuthenticated: boolean;
    user: null | { id: string; email: string };
};

const initialState: UserState = {
    isAuthenticated: false,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ id: string; email: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export default store;
