import api from './api/api';

import { AxiosResponse } from 'axios';
import { AuthenticationDto } from '../interfaces/auth/dto/AuthenticationDto';
import { SignInDto } from '../interfaces/auth/dto/SignInDto';
import { SignUpDto } from '../interfaces/auth/dto/SignUpDto';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/config/constants';
import Storage from '@/utils/Storage';

export default class AuthService {
  /**
   * Login user
   * @param {Credentials} credentials Username & Password
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} User's data and token
   */
  static async login(credentials: SignInDto): Promise<AxiosResponse<AuthenticationDto>> {
    Storage.remove(TOKEN_KEY);
    Storage.remove(REFRESH_TOKEN_KEY);
    console.log('login credentials', credentials);
    return api.post<AuthenticationDto>('/auth/sign-in', credentials);
  }

  /**
   * Create user
   * @param {Credentials} credentials Username & Email & Password
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} User's data and token
   */
  static async register(credentials: SignUpDto): Promise<AxiosResponse<AuthenticationDto>> {
    Storage.remove(TOKEN_KEY);
    Storage.remove(REFRESH_TOKEN_KEY);
    console.log('register credentials', credentials);
    return api.post<AuthenticationDto>('/auth/sign-up', credentials);
  }

  /**
   * Save the token in the local storage
   * @param {string} token Access token
   * @param {string} rtoken Refresh token
   */
  static saveToken(token: string, rtoken: string): void {
    if (Storage.isLocalStorageAvailable()) {
      Storage.set(TOKEN_KEY, token);
      Storage.set(REFRESH_TOKEN_KEY, rtoken);
    } else {
      console.warn('Unable to save token, localStorage is not available');
    }
  }

  /**
   * Reset password
   * @param {string} token Reset token
   * @param {string} newPassword New password
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async resetPassword(token: string, newPassword: string): Promise<AxiosResponse<void>> {
    return api.post<void>('/auth/reset-password', { token, newPassword });
  }

  /**
   * Request password reset
   * @param {string} email User's email
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async requestPasswordReset(email: string): Promise<AxiosResponse<void>> {
    return api.post<void>('/auth/request-password-reset', { email });
  }

  /**
   * Refresh access token
   * @param {string} refreshToken Refresh token
   * @returns {Promise<AxiosResponse<AuthenticationDto>>}
   */
  static async refreshToken(refreshToken: string): Promise<AxiosResponse<AuthenticationDto>> {
    return api.post<AuthenticationDto>('/auth/refresh', { refreshToken });
  }

  /**
   * Confirm email
   * @param {string} token Confirmation token
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async confirmEmail(token: string): Promise<AxiosResponse<void>> {
    return api.post<void>('/auth/confirm', { token });
  }

  /**
   * Resend confirmation email
   * @param {string} email User's email
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async resendConfirmation(email: string): Promise<AxiosResponse<void>> {
    return api.get<void>('/auth/resend-confirmation', { params: { email } });
  }

  /**
   * Sign out user
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async signOut(): Promise<AxiosResponse<void>> {
    return api.delete<void>('/auth/sign-out');
  }

  /**
   * Get current user
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} Current user's data
   */
  static async getCurrentUser(): Promise<AxiosResponse<AuthenticationDto>> {
    return api.get<AuthenticationDto>('/auth/me');
  }
}