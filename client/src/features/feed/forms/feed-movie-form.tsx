'use client';
import React, { useEffect, useState } from 'react';
import FeedService from '@/services/FeedService';
import { MovieGrid } from '@/features/movies/schemas/MovieGrid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import WatchListService from '@/services/WatchListService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MovieViewService from '@/services/MovieViewService';
import InputWatchListInfo from '@/features/watchlists/schemas/InputWatchListForm';
import { WatchListCreateDto } from '@/interfaces/watchlist/dto/WatchListCreateDto';

export const FeedMovieForm: React.FC = () => {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [watchlists, setWatchlists] = useState<WatchListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRecommendedMovies();
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    WatchListService.getWatchListsForUser(user.id)
      .then((responseWatchlist) => {
        setWatchlists(responseWatchlist.data.content);
      })
      .catch((error) => {
        console.error('Failed to fetch watchlist details', error);
        toast.error('Не удалось загрузить информацию о коллекции');
      })
      .finally(() => {
      });
  }, [user]);

  const loadRecommendedMovies = async () => {
    try {
      setIsLoading(true);
      const response = await FeedService.getRecommendedMovies();
      setMovies(response.data.content);
    } catch (error) {
      toast.error('Не удалось загрузить рекомендованные фильмы');
      console.error('Error loading recommended movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  const handleAddToWatchlist = (movieId: number, watchlistId: number) => {
    WatchListService.addMovieToWatchList(watchlistId, movieId)
      .then(() => {
        toast.success('Фильм добавлен в коллекцию');
      })
      .catch((error) => {
        console.error('Failed to add movie to watchlist', error);
        toast.error('Не удалось добавить фильм в коллекцию');
      });
  }

  const handleMarkAsWatched = (movieId: number) => {
    MovieViewService.markMovieAsViewed(movieId)
      .then(() => {
        toast.success('Фильм помечен как просмотренный');
      })
      .catch((error) => {
        console.error('Failed to mark movie as watched', error);
        toast.error('Не удалось пометить фильм как просмотренный');
      });
  }

  return (
    <div className='feed-movie-form'>
      {movies.length === 0 ? (
        <p>No recommended movies found</p>
      ) : (
        <MovieGrid
          movies={movies}
          loading={isLoading}
          onClick={handleMovieClick}
          renderContextMenu={true}
          onAddToWatchlist={handleAddToWatchlist}
          onMarkAsWatched={handleMarkAsWatched}
          watchlists={watchlists.map((watchlist) => ({id: watchlist.id, name: watchlist.name}))}
        />
      )}
    </div>
  );
};
