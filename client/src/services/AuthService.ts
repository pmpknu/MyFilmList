import instance, { api } from './api/api';

import { AxiosResponse } from 'axios';
import Storage from '@/lib/utils/Storage';
import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from '@/constants';
import { AuthenticationDto } from '@/interfaces/auth/dto/AuthenticationDto';
import { SignInDto } from '@/interfaces/auth/dto/SignInDto';
import { SignUpDto } from '@/interfaces/auth/dto/SignUpDto';

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
   * @param {Credentials} credentials Username & Email & Password
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} User's data and token
   */
  static async register(credentials: SignUpDto): Promise<AxiosResponse<AuthenticationDto>> {
    return api.post<AuthenticationDto>('/auth/sign-up', credentials);
  }

  /**
   * Save the token in the local storage
   * @param {string} dto DTO with user and tokens
   */
  static setAuth(dto: AuthenticationDto): void {
    if (Storage.isLocalStorageAvailable()) {
      Storage.set(USER_KEY, dto.user);
      Storage.set(TOKEN_KEY, dto.accessToken);
      Storage.set(REFRESH_TOKEN_KEY, dto.refreshToken);
    } else {
      console.warn('Unable to save token, localStorage is not available');
    }
  }

  /**
   * Login user
   * @returns {AuthenticationDto} User's data and token
   */
  static getAuth(): AuthenticationDto {
    return {
      tokenType: 'Bearer',
      user: Storage.get(USER_KEY),
      accessToken: Storage.get(TOKEN_KEY),
      refreshToken: Storage.get(REFRESH_TOKEN_KEY)
    } satisfies AuthenticationDto;
  }

  /**
   * Delete token from the local storage
   */
  static forgetAuth(): void {
    Storage.remove(USER_KEY);
    Storage.remove(TOKEN_KEY);
    Storage.remove(REFRESH_TOKEN_KEY);
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
  static async confirmEmail(token: string): Promise<AxiosResponse<AuthenticationDto>> {
    return api.post<AuthenticationDto>('/auth/confirm', { verificationToken: token });
  }

  /**
   * Resend confirmation email
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async resendConfirmation(): Promise<AxiosResponse<AuthenticationDto>> {
    return instance.get<AuthenticationDto>('/auth/resend-confirmation');
  }

  /**
   * Sign out user
   * @returns {Promise<AxiosResponse<void>>}
   */
  static async signOut(): Promise<AxiosResponse<void>> {
    return instance.delete<void>(`/auth/sign-out`);
  }

  /**
   * Get current user
   * @returns {Promise<AxiosResponse<AuthenticationDto>>} Current user's data
   */
  static async getCurrentUser(): Promise<AxiosResponse<AuthenticationDto>> {
    return instance.get<AuthenticationDto>('/auth/me');
  }
}
