import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import requestReducer from './slices/request-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestReducer
  }
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
