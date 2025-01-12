import axios from 'axios';
import Storage from '../../utils/Storage';
import { TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '../../config/constants';
import store from '../../store';
import { addRequest } from '../../store/slices/requestSlice';
import { RefreshDto } from '@/interfaces/refresh/dto/RefreshDto';

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
    if (error.response.status === 403 && !originalConfig._isRetry) {
      // eslint-disable-next-line no-underscore-dangle
      originalConfig._isRetry = true;

      try {
        const rtoken: RefreshDto = Storage.get(REFRESH_TOKEN_KEY);
        if (!rtoken) {
          console.log('Missing refresh token');
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, { rtoken });
        Storage.set(TOKEN_KEY, response.data.accessToken);
        Storage.set(REFRESH_TOKEN_KEY, response.data.refreshToken);
        originalConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return instance.request(originalConfig);
      } catch (_error) {
        console.error('Token refresh failed', _error, 'token: ', Storage.get(TOKEN_KEY));
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;