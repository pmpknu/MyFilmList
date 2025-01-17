import { AxiosError } from 'axios';

export default interface ApiError {
  code: string;
  status: string;
  message: string;
  errors: string[];
}

export const extractApiError = (error: unknown) => {
  return {
    code: (<AxiosError>error)?.response?.status.toString(),
    ...((<AxiosError>error)?.response?.data as Record<string, unknown>)
  } as ApiError;
};
