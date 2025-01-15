import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import Storage from '../../utils/Storage';
import { REQUESTS_KEY, REQUEST_UUIDS_HISTORY_LENGTH } from '../../config/constants';

export interface RequestsState {
  uuids: string[];
}

const initialState: RequestsState = {
  uuids: Storage.isLocalStorageAvailable() ? Storage.get(REQUESTS_KEY) || [] : [],
};

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest: (state, action: PayloadAction<string>) => {
      const newUuid = action.payload.startsWith('[')
      ? action.payload.slice(1, -1)
      : action.payload;

      state.uuids.push(newUuid);
      if (state.uuids.length > REQUEST_UUIDS_HISTORY_LENGTH) {
        state.uuids.shift();
      }

      Storage.set(REQUESTS_KEY, state.uuids);
    },
  },
});

export const { addRequest } = requestsSlice.actions;
export default requestsSlice.reducer;