import api from './api/api';
import { AxiosResponse } from 'axios';
import { RatingCreateDto } from '@/interfaces/rating/dto/RatingCreateDto';
import { RatingDto } from '@/interfaces/rating/dto/RatingDto';
import { RatingUpdateDto } from '@/interfaces/rating/dto/RatingUpdateDto';
import { RatingWithoutMovieDto } from '@/interfaces/rating/dto/RatingWithoutMovieDto';
import { RatingWithoutUserDto } from '@/interfaces/rating/dto/RatingWithoutUserDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/lib/utils/uri';

export default class RatingService {
  /**
   * Get all ratings for a movie
   * @param {number} movieId Movie ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<RatingWithoutMovieDto>>>} List of ratings for the movie
   */
  static async getRatingsForMovie(
    movieId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<RatingWithoutMovieDto>>> {
    return api.get<Paged<RatingWithoutMovieDto>>(
      `/movies/${movieId}/ratings${createCrudUri(page, size, sort)}`
    );
  }

  /**
   * Add a rating to a movie
   * @param {number} movieId Movie ID
   * @param {RatingCreateDto} ratingData Rating data to add
   * @returns {Promise<AxiosResponse<RatingDto>>} Response with the created rating
   */
  static async addRatingToMovie(
    movieId: number,
    ratingData: RatingCreateDto
  ): Promise<AxiosResponse<RatingDto>> {
    return api.post<RatingDto>(`/movies/${movieId}/ratings`, ratingData);
  }

  /**
   * Delete a rating for a movie
   * @param {number} movieId Movie ID
   * @returns {Promise<AxiosResponse<void>>} Response confirming the deletion
   */
  static async deleteRatingForMovie(
    movieId: number
  ): Promise<AxiosResponse<void>> {
    return api.delete<void>(`/movies/${movieId}/ratings`);
  }

  /**
   * Update a rating for a movie
   * @param {number} movieId Movie ID
   * @param {RatingUpdateDto} ratingData Updated rating data
   * @returns {Promise<AxiosResponse<RatingDto>>} Response with the updated rating
   */
  static async updateRatingForMovie(
    movieId: number,
    ratingData: RatingUpdateDto
  ): Promise<AxiosResponse<RatingDto>> {
    return api.patch<RatingDto>(`/movies/${movieId}/ratings`, ratingData);
  }

  /**
   * Get all ratings by a user
   * @param {number} userId User ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<RatingWithoutUserDto>>>} List of ratings by the user
   */
  static async getRatingsByUser(
    userId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<RatingWithoutUserDto>>> {
    return api.get<Paged<RatingWithoutUserDto>>(
      `/users/${userId}/ratings${createCrudUri(page, size, sort)}`
    );
  }
}
