import api from './api/api';
import { AxiosResponse } from 'axios';
import { MovieViewDto } from '@/interfaces/movieview/dto/MovieViewDto';
import { MovieViewWithoutMovieDto } from '@/interfaces/movieview/dto/MovieViewWithoutMovieDto';
import { MovieViewWithoutUserDto } from '@/interfaces/movieview/dto/MovieViewWithoutUserDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/lib/utils/uri';

export default class MovieViewService {
  /**
   * Get all views for a movie
   * @param {number} movieId Movie ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<MovieViewWithoutMovieDto>>>} List of views for the movie
   */
  static async getViewsForMovie(
    movieId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<MovieViewWithoutMovieDto>>> {
    return api.get<Paged<MovieViewWithoutMovieDto>>(
      `/movies/${movieId}/views${createCrudUri(page, size, sort)}`
    );
  }

  /**
   * Mark a movie as viewed
   * @param {number} movieId Movie ID
   * @returns {Promise<AxiosResponse<MovieViewDto>>} Response confirming the view action
   */
  static async markMovieAsViewed(
    movieId: number
  ): Promise<AxiosResponse<MovieViewDto>> {
    return api.post<MovieViewDto>(`/movies/${movieId}/views`, {});
  }

  /**
   * Unmark a movie as viewed
   * @param {number} movieId Movie ID
   * @returns {Promise<AxiosResponse<void>>} Response confirming the unview action
   */
  static async unmarkMovieAsViewed(
    movieId: number
  ): Promise<AxiosResponse<void>> {
    return api.delete<void>(`/movies/${movieId}/views`);
  }

  /**
   * Get all views for a user
   * @param {number} userId User ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<MovieViewWithoutUserDto>>>} List of views for the user
   */
  static async getViewsForUser(
    userId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<MovieViewWithoutUserDto>>> {
    return api.get<Paged<MovieViewWithoutUserDto>>(
      `/users/${userId}/views${createCrudUri(page, size, sort)}`
    );
  }
}
