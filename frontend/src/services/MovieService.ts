import api from './api/api';
import { AxiosResponse } from 'axios';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { MovieUpdateDto } from '@/interfaces/movie/dto/MovieUpdateDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';

export default class MovieService {
    /**
     * Get all movies with pagination
     * @param {number} page Page number
     * @param {number} size Page size
     * @returns {Promise<AxiosResponse<Paged<MovieDto>>>} Page of all movies with total count
     */
    static async getAllMovies(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<MovieDto>>> {
        return api.get<Paged<MovieDto>>(`/api/movies${createCrudUri(page, size, sort)}`);
    }

    /**
     * Create a new movie
     * @param {MovieDto} movieData Movie data to create
     * @returns {Promise<AxiosResponse<MovieDto>>} Created movie data
     */
    static async createMovie(movieData: MovieDto): Promise<AxiosResponse<MovieDto>> {
        return api.post<MovieDto>('/api/movies', movieData);
    }

    /**
     * Get movie by ID
     * @param {number} id Movie ID
     * @returns {Promise<AxiosResponse<MovieDto>>} Movie data
     */
    static async getMovieById(id: number): Promise<AxiosResponse<MovieDto>> {
        return api.get<MovieDto>(`/api/movies/${id}`);
    }

    /**
     * Delete movie by ID
     * @param {number} id Movie ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async deleteMovie(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/movies/${id}`);
    }

    /**
     * Update movie by ID
     * @param {number} id Movie ID
     * @param {MovieUpdateDto} movieData Updated movie data
     * @returns {Promise<AxiosResponse<MovieDto>>} Updated movie data
     */
    static async updateMovie(id: number, movieData: MovieUpdateDto): Promise<AxiosResponse<MovieDto>> {
        return api.patch<MovieDto>(`/api/movies/${id}`, movieData);
    }

    /**
     * Upload poster for the movie
     * @param {FormData} formData Form data containing the poster
     * @param {number} id Movie ID
     * @returns {Promise<AxiosResponse<MovieDto>>} Updated movie data with poster
     */
    static async uploadPoster(id: number, formData: FormData): Promise<AxiosResponse<MovieDto>> {
        return api.post<MovieDto>(`/api/movies/${id}/poster`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Search and filter movies
     * @param {SearchDto} searchParams Search parameters
     * @returns {Promise<AxiosResponse<Paged<MovieDto>>>} List of movies
     */
    static async searchMovies(searchParams: SearchDto, page: number = 0, size: number = 1, sort: string[] = []): Promise<AxiosResponse<Paged<MovieDto>>> {
        return api.post<Paged<MovieDto>>(`/api/movies/search${createCrudUri(page, size, sort)}`, searchParams);
    }
}
