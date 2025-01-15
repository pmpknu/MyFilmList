import api from './api/api';
import { AxiosResponse } from 'axios';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';

export default class FeedService {
    /**
     * Get recommended movies
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<MovieDto>>>} List of recommended movies
     */
    static async getRecommendedMovies(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<MovieDto>>> {
        return api.get<Paged<MovieDto>>(`/movies/feed${createCrudUri(page, size, sort)}`);
    }

    /**
     * Get recommended watchlists
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} List of recommended watchlists
     */
    static async getRecommendedWatchLists(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.get<Paged<WatchListDto>>(`/watchlists/feed${createCrudUri(page, size, sort)}`);
    }
}
