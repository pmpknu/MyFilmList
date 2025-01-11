import api from './api/api';

import { AxiosResponse } from 'axios';
import { AuthenticationDto } from '../interfaces/auth/dto/AuthenticationDto';
import { SignInDto } from '../interfaces/auth/dto/SignInDto';
import { SignUpDto } from '../interfaces/auth/dto/SignUpDto';
import { TOKEN_KEY } from '@/config/constants';
import Storage from '@/utils/Storage';

export default class AuthService {
  /**
   * Login user
   * @param {Credentials} credentials Username & Password
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} User's data and token
   */
  static async login(credentials: SignInDto): Promise<AxiosResponse<AuthenticationDto>> {
    return api.post<AuthenticationDto>('/auth/sign-in', credentials);
  }

  /**
   * Create user
   * @param {Credentials} credentials Username & Password
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} User's data and token
   */
  static async register(credentials: SignUpDto): Promise<AxiosResponse<AuthenticationDto>> {
    return api.post<AuthenticationDto>('/auth/sign-up', credentials);
  }

  /**
   * Save the token in the local storage
   * @param {string} token Access token
   */
  static saveToken(token: string): void {
    if (Storage.isLocalStorageAvailable()) {
      Storage.set(TOKEN_KEY, token);
    } else {
      console.warn('Unable to save token, localStorage is not available');
    }
  }
}