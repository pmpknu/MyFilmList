import api from './api/api';
import { AxiosResponse } from 'axios';
import { ReviewCreateDto } from '@/interfaces/review/dto/ReviewCreateDto';
import { ReviewDto } from '@/interfaces/review/dto/ReviewDto';
import { ReviewUpdateDto } from '@/interfaces/review/dto/ReviewUpdateDto';
import { ReviewWithoutMovieDto } from '@/interfaces/review/dto/ReviewWithoutMovieDto';
import { ReviewWithoutUserDto } from '@/interfaces/review/dto/ReviewWithoutUserDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';

export default class ReviewService {
    /**
     * Get all reviews for a movie
     * @param {number} movieId Movie ID
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReviewWithoutMovieDto>>>} List of reviews for the movie
     */
    static async getReviewsForMovie(movieId: number, page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReviewWithoutMovieDto>>> {
        return api.get<Paged<ReviewWithoutMovieDto>>(`/api/movies/${movieId}/reviews${createCrudUri(page, size, sort)}`);
    }

    /**
     * Add a review to a movie
     * @param {number} movieId Movie ID
     * @param {ReviewCreateDto} reviewData Review data
     * @returns {Promise<AxiosResponse<ReviewDto>>} Created review data
     */
    static async addReviewToMovie(movieId: number, reviewData: ReviewCreateDto): Promise<AxiosResponse<ReviewDto>> {
        return api.post<ReviewDto>(`/api/movies/${movieId}/reviews`, reviewData);
    }

    /**
     * Get all reviews
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReviewDto>>>} List of all reviews
     */
    static async getAllReviews(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReviewDto>>> {
        return api.get<Paged<ReviewDto>>(`/api/reviews${createCrudUri(page, size, sort)}`);
    }

    /**
     * Get a review by ID
     * @param {number} id Review ID
     * @returns {Promise<AxiosResponse<ReviewDto>>} Review data
     */
    static async getReviewById(id: number): Promise<AxiosResponse<ReviewDto>> {
        return api.get<ReviewDto>(`/api/reviews/${id}`);
    }

    /**
     * Delete a review by ID
     * @param {number} id Review ID
     * @returns {Promise<AxiosResponse<void>>} Response with no content
     */
    static async deleteReview(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/reviews/${id}`);
    }

    /**
     * Update a review by ID
     * @param {number} id Review ID
     * @param {ReviewUpdateDto} reviewData Updated review data
     * @returns {Promise<AxiosResponse<ReviewDto>>} Updated review data
     */
    static async updateReview(id: number, reviewData: ReviewUpdateDto): Promise<AxiosResponse<ReviewDto>> {
        return api.patch<ReviewDto>(`/api/reviews/${id}`, reviewData);
    }

    /**
     * Search and filter reviews
     * @param {any} searchParams Search parameters
     * @returns {Promise<AxiosResponse<Paged<ReviewDto>>>} Filtered list of reviews
     */
    static async searchReviews(searchParams: SearchDto, page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReviewDto>>> {
        return api.post<Paged<ReviewDto>>(`/api/reviews/search${createCrudUri(page, size, sort)}`, searchParams);
    }

    /**
     * Get all reviews by a user
     * @param {number} userId User ID
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReviewWithoutUserDto>>>} List of reviews by the user
     */
    static async getReviewsByUser(userId: number, page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReviewWithoutUserDto>>> {
        return api.get<Paged<ReviewWithoutUserDto>>(`/api/users/${userId}/reviews${createCrudUri(page, size, sort)}`);
    }
}
