import MoviePoster, { MoviePosterProps } from '@/components/MoviePoster';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import FeedService from '@/services/FeedService';
import router from 'next/router';
import { useEffect, useState } from 'react';

const FeedPage = () => {

  const [movies, setMovies] = useState<MovieDto[]>([]);

  useEffect(() => {
    FeedService.getRecommendedMovies()
      .then((response) => {
        setMovies(response.data.content);
      })
      .catch((error) => {
        console.error('Failed to fetch movies', error);
      });
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MoviePoster
          key={movie.title}
          posterUrl={movie.poster}
          title={movie.title}
          handleFunction={() => router.push(`/movie/${movie.id}`)}
        />
      ))}
    </div>
  );
};

export default FeedPage;
