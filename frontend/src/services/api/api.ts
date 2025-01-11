import axios from 'axios';
import Storage from '../../utils/Storage';
import { TOKEN_KEY, API_URL } from '../../config/constants';
import store from '../../store';
import { addRequest } from '../../store/slices/requestSlice';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

instance.interceptors.request.use(
  config => {
    const token = Storage.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    const { dispatch } = store; // direct access to redux store.
    dispatch(addRequest(response.headers['x-response-uuid']));
    return response;
  },
  async error => {
    const originalConfig = error.config;

    // Access Token was expired
    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 401 && !originalConfig._isRetry) {
      // eslint-disable-next-line no-underscore-dangle
      originalConfig._isRetry = true;

      try {
        return instance.request(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;