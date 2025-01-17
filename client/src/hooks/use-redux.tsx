'use client';

import { AppDispatch, RootState, AppStore } from '@/store';
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  useStore as useReduxStore
} from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();
export const useStore = useReduxStore.withTypes<AppStore>();

