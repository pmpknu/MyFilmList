import axios from 'axios';
import Storage from '@/lib/utils/Storage';
import { TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '@/constants';
import { RefreshDto } from '@/interfaces/refresh/dto/RefreshDto';
import { AuthenticationDto } from '@/interfaces/auth/dto/AuthenticationDto';
import AuthService from '../AuthService';
import store from '@/store';
import { addRequest } from '@/store/slices/request-slice';
import { login } from '@/store/slices/auth-slice';

const browserLang = navigator?.language;
const supportedLocales = ['en', 'ru'];
// fallback to 'ru-RU' if the browser's language is not supported
let detectedLocale = 'ru';

if (supportedLocales.includes(browserLang)) {
  detectedLocale = browserLang;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': detectedLocale,
    Accept: 'application/json'
  },
  timeout: 10000
});

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': detectedLocale,
    Accept: 'application/json'
  },
  timeout: 10000
});

instance.interceptors.request.use(
  (config) => {
    const token = Storage.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const { dispatch } = store;
    dispatch(addRequest(response.headers['x-response-uuid']));
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const dispatch = store.dispatch;

    // Access Token was expired
    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 403 && !originalConfig._isRetry) {
      // eslint-disable-next-line no-underscore-dangle
      originalConfig._isRetry = true;

      try {
        const refreshToken: RefreshDto = Storage.get(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          console.info('Missing refresh token');
          return Promise.reject(error);
        }

        const response = await axios.post<AuthenticationDto>(`${API_URL}/auth/refresh`, {
          refreshToken
        });
        AuthService.setAuth(response.data);
        dispatch(login(response.data));

        originalConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return instance.request(originalConfig);
      } catch (_error) {
        console.error(
          `Token refresh failed!\ntoken: ${Storage.get(TOKEN_KEY)}\n refresh token: ${Storage.get(REFRESH_TOKEN_KEY)}\n`,
          _error
        );
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
