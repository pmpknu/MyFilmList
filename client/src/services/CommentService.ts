import api from './api/api';
import { AxiosResponse } from 'axios';
import { CommentDto } from '@/interfaces/comment/dto/CommentDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/lib/utils/uri';
import { CommentUpdateDto } from '@/interfaces/comment/dto/CommentUpdateDto';

export default class CommentService {
  /**
   * Get all comments for a movie
   * @param {number} movieId Movie ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<CommentDto>>>} List of comments for the movie
   */
  static async getCommentsForMovie(
    movieId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<CommentDto>>> {
    return api.get<Paged<CommentDto>>(
      `/movies/${movieId}/comments${createCrudUri(page, size, sort)}`
    );
  }

  /**
   * Add a comment to a movie
   * @param {number} movieId Movie ID
   * @param {CommentDto} commentData Comment data
   * @returns {Promise<AxiosResponse<CommentDto>>} Created comment data
   */
  static async addCommentToMovie(
    movieId: number,
    commentData: CommentDto
  ): Promise<AxiosResponse<CommentDto>> {
    return api.post<CommentDto>(`/movies/${movieId}/comments`, commentData);
  }

  /**
   * Get all comments for a review
   * @param {number} reviewId Review ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<CommentDto>>>} List of comments for the review
   */
  static async getCommentsForReview(
    reviewId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<CommentDto>>> {
    return api.get<Paged<CommentDto>>(
      `/reviews/${reviewId}/comments${createCrudUri(page, size, sort)}`
    );
  }

  /**
   * Add a comment to a review
   * @param {number} reviewId Review ID
   * @param {CommentDto} commentData Comment data
   * @returns {Promise<AxiosResponse<CommentDto>>} Created comment data
   */
  static async addCommentToReview(
    reviewId: number,
    commentData: CommentDto
  ): Promise<AxiosResponse<CommentDto>> {
    return api.post<CommentDto>(`/reviews/${reviewId}/comments`, commentData);
  }

  /**
   * Get all comments for a watchlist
   * @param {number} watchListId Watchlist ID
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string[]} sort Sorting parameters
   * @returns {Promise<AxiosResponse<Paged<CommentDto>>>} List of comments for the watchlist
   */
  static async getCommentsForWatchlist(
    watchListId: number,
    page: number = 0,
    size: number = 20,
    sort: string[]
  ): Promise<AxiosResponse<Paged<CommentDto>>> {
    return api.get<Paged<CommentDto>>(
      `/watchlists/${watchListId}/comments${createCrudUri(page, size, sort)}`
    );
  }

  /**
   * Add a comment to a watchlist
   * @param {number} watchListId Watchlist ID
   * @param {CommentDto} commentData Comment data
   * @returns {Promise<AxiosResponse<CommentDto>>} Created comment data
   */
  static async addCommentToWatchlist(
    watchListId: number,
    commentData: CommentDto
  ): Promise<AxiosResponse<CommentDto>> {
    return api.post<CommentDto>(
      `/watchlists/${watchListId}/comments`,
      commentData
    );
  }

  /**
   * Delete a comment by ID
   * @param {number} id Comment ID
   * @returns {Promise<AxiosResponse<void>>} Response with no content
   */
  static async deleteComment(id: number): Promise<AxiosResponse<void>> {
    return api.delete<void>(`/comments/${id}`);
  }

  /**
   * Update a comment by ID
   * @param {number} id Comment ID
   * @param {CommentDto} commentData Updated comment data
   * @returns {Promise<AxiosResponse<CommentDto>>} Updated comment data
   */
  static async updateComment(
    id: number,
    commentData: CommentUpdateDto
  ): Promise<AxiosResponse<CommentDto>> {
    return api.patch<CommentDto>(`/comments/${id}`, commentData);
  }
}
