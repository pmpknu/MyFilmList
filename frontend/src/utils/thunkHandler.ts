import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiError } from "./ApiError";

export const createAsyncThunkHandler = (name: string, asyncHandler: (...params: any[]) => Promise<any>) => {
    return createAsyncThunk(
        name,
        async (params: any[], { rejectWithValue }) => {
            try {
                const response = await asyncHandler(...params);
                return response.data;
            } catch (error) {
                return rejectWithValue(extractApiError(error));
            }
        }
    );
};