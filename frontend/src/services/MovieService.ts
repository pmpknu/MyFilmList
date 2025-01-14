import api from './api/api';
import { AxiosResponse } from 'axios';
import { MovieCreateDto } from '@/interfaces/movie/dto/MovieCreateDto';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { MovieUpdateDto } from '@/interfaces/movie/dto/MovieUpdateDto';
import { MovieWithAdditionalInfoDto } from '@/interfaces/movie/dto/MovieWithAdditionalInfoDto';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';

export default class MovieService {
    /**
     * Get all movies
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<MovieWithAdditionalInfoDto>>>} List of movies
     */
    static async getAllMovies(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<MovieWithAdditionalInfoDto>>> {
        return api.get<Paged<MovieWithAdditionalInfoDto>>(`/movies${createCrudUri(page, size, sort)}`);
    }

    /**
     * Create a new movie
     * @param {MovieCreateDto} movieData Data for creating the movie
     * @returns {Promise<AxiosResponse<MovieDto>>} Created movie data
     */
    static async createMovie(movieData: MovieCreateDto): Promise<AxiosResponse<MovieDto>> {
        return api.post<MovieDto>('/movies', movieData);
    }

    /**
     * Get a movie by ID
     * @param {number} id Movie ID
     * @returns {Promise<AxiosResponse<MovieWithAdditionalInfoDto>>} Movie data
     */
    static async getMovieById(id: number): Promise<AxiosResponse<MovieWithAdditionalInfoDto>> {
        return api.get<MovieWithAdditionalInfoDto>(`/movies/${id}`);
    }

    /**
     * Delete a movie by ID
     * @param {number} id Movie ID
     * @returns {Promise<AxiosResponse<void>>} Response with no content
     */
    static async deleteMovie(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/movies/${id}`);
    }

    /**
     * Update a movie by ID
     * @param {number} id Movie ID
     * @param {MovieUpdateDto} movieData Updated movie data
     * @returns {Promise<AxiosResponse<MovieDto>>} Updated movie data
     */
    static async updateMovie(id: number, movieData: MovieUpdateDto): Promise<AxiosResponse<MovieDto>> {
        return api.patch<MovieDto>(`/movies/${id}`, movieData);
    }

    /**
     * Upload a poster for a movie
     * @param {number} id Movie ID
     * @param {FormData} formData Form data containing the poster
     * @returns {Promise<AxiosResponse<MovieDto>>} Updated movie data with poster
     */
    static async uploadMoviePoster(id: number, formData: FormData): Promise<AxiosResponse<MovieDto>> {
        return api.post<MovieDto>(`/movies/${id}/poster`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Search and filter movies
     * @param {SearchDto} searchParams Search parameters
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<MovieWithAdditionalInfoDto>>>} Filtered list of movies
     */
    static async searchMovies(searchParams: SearchDto, page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<MovieWithAdditionalInfoDto>>> {
        return api.post<Paged<MovieWithAdditionalInfoDto>>(`/movies/search${createCrudUri(page, size, sort)}`, searchParams);
    }
}
