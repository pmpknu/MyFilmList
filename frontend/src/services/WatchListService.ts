import api from './api/api';
import { AxiosResponse } from 'axios';
import { WatchListCreateDto } from '@/interfaces/watchlist/dto/WatchListCreateDto';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import { WatchListUpdateDto } from '@/interfaces/watchlist/dto/WatchListUpdateDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';

export default class WatchListService {
    /**
     * Get all watchlists containing a specific movie
     * @param {number} movieId Movie ID
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} List of watchlists
     */
    static async getWatchListsForMovie(movieId: number, page: number = 0, size: number = 20, sort: string[]): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.get<Paged<WatchListDto>>(`/api/movies/${movieId}/watchlists${createCrudUri(page, size, sort)}`);
    }

    /**
     * Get all watchlists for a user
     * @param {number} userId User ID
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} List of watchlists
     */
    static async getWatchListsForUser(userId: number, page: number = 0, size: number = 20, sort: string[]): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.get<Paged<WatchListDto>>(`/api/users/${userId}/watchlists${createCrudUri(page, size, sort)}`);
    }

    /**
     * Get all watchlists
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} List of watchlists
     */
    static async getAllWatchLists(page: number = 0, size: number = 20, sort: string[]): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.get<Paged<WatchListDto>>(`/api/watchlists${createCrudUri(page, size, sort)}`);
    }

    /**
     * Create a new watchlist
     * @param {WatchListCreateDto} watchListData Watchlist data
     * @returns {Promise<AxiosResponse<WatchListDto>>} Created watchlist
     */
    static async createWatchList(watchListData: WatchListCreateDto): Promise<AxiosResponse<WatchListDto>> {
        return api.post<WatchListDto>('/api/watchlists', watchListData);
    }

    /**
     * Get a watchlist by ID
     * @param {number} id Watchlist ID
     * @returns {Promise<AxiosResponse<WatchListDto>>} Watchlist data
     */
    static async getWatchListById(id: number): Promise<AxiosResponse<WatchListDto>> {
        return api.get<WatchListDto>(`/api/watchlists/${id}`);
    }

    /**
     * Delete a watchlist by ID
     * @param {number} id Watchlist ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async deleteWatchList(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/watchlists/${id}`);
    }

    /**
     * Update a watchlist by ID
     * @param {number} id Watchlist ID
     * @param {WatchListUpdateDto} watchListData Updated watchlist data
     * @returns {Promise<AxiosResponse<WatchListDto>>} Updated watchlist
     */
    static async updateWatchList(id: number, watchListData: WatchListUpdateDto): Promise<AxiosResponse<WatchListDto>> {
        return api.patch<WatchListDto>(`/api/watchlists/${id}`, watchListData);
    }

    /**
     * Get all movies in a watchlist
     * @param {number} id Watchlist ID
     * @returns {Promise<AxiosResponse<any[]>>} List of movies
     */
    static async getMoviesInWatchList(id: number): Promise<AxiosResponse<any[]>> {
        return api.get<any[]>(`/api/watchlists/${id}/movies`);
    }

    /**
     * Add a movie to a watchlist
     * @param {number} id Watchlist ID
     * @param {number} movieId Movie ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async addMovieToWatchList(id: number, movieId: number): Promise<AxiosResponse<void>> {
        return api.post<void>(`/api/watchlists/${id}/movies/${movieId}`);
    }

    /**
     * Remove a movie from a watchlist
     * @param {number} id Watchlist ID
     * @param {number} movieId Movie ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async removeMovieFromWatchList(id: number, movieId: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/watchlists/${id}/movies/${movieId}`);
    }

    /**
     * Upload an image for a watchlist
     * @param {number} id Watchlist ID
     * @param {FormData} formData Form data containing the image
     * @returns {Promise<AxiosResponse<WatchListDto>>} Updated watchlist
     */
    static async uploadWatchListPhoto(id: number, formData: FormData): Promise<AxiosResponse<WatchListDto>> {
        return api.post<WatchListDto>(`/api/watchlists/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Search and filter watchlists
     * @param {any} searchParams Search parameters
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} Filtered watchlists
     */
    static async searchWatchLists(searchParams: any, page: number = 0, size: number = 20, sort: string[]): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.post<Paged<WatchListDto>>(`/api/watchlists/search${createCrudUri(page, size, sort)}`, searchParams);
    }
}
