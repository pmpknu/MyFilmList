import api from './api/api';
import { AxiosResponse } from 'axios';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import Paged from '@/interfaces/paged/models/Paged';

export default class FeedService {
    /**
     * Get recommended movies
     * @returns {Promise<AxiosResponse<Paged<MovieDto>>>} List of recommended movies
     */
    static async getRecommendedMovies(): Promise<AxiosResponse<Paged<MovieDto>>> {
        return api.get<Paged<MovieDto>>('/movies/feed');
    }

    /**
     * Get recommended watchlists
     * @returns {Promise<AxiosResponse<Paged<WatchListDto>>>} List of recommended watchlists
     */
    static async getRecommendedWatchLists(): Promise<AxiosResponse<Paged<WatchListDto>>> {
        return api.get<Paged<WatchListDto>>('/watchlists/feed');
    }
}
