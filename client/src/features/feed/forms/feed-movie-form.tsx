"use client";
import React, { useEffect, useState } from 'react';
import FeedService from '@/services/FeedService';
import { MovieGrid } from '@/features/movies/schemas/MovieGrid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';

export const FeedMovieForm: React.FC = () => {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRecommendedMovies();
  }, []);

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

  return (
    <div className="feed-movie-form">
      {movies.length === 0 ? (
        <p>No recommended movies found</p>
      ) : (
        <MovieGrid movies={movies} loading={isLoading} onClick={handleMovieClick} />
      )}
    </div>
  );
};