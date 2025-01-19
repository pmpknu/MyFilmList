'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { RootState } from '@/store';
import { Role } from '@/interfaces/role/model/UserRole';
import MovieService from '@/services/MovieService';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import MoviePosterUpdateForm from '../movie-update-poster-form';

export default function MoviePosterUpdateViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [loading, setLoading] = useState(true);

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isUserAdmin = useSelector(
    (state: RootState) => !!(state.auth.user?.roles.includes(Role.ROLE_ADMIN))
  );

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для обновления постера фильма');
      router.push('/');
    } else if (!isUserAuthenticated) {
      toast.error('Для обновления постера фильма необходимо войти в аккаунт');
      router.push('/auth/sign-in');
    }
  }, [isUserAuthenticated, isUserAdmin, router]);

  useEffect(() => {
    if (!id) return;
    const movieId = parseInt(String(id));
    if (!movieId) return;

    setLoading(true);
    MovieService.getMovieById(movieId)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch movie details:', error);
        toast.error('Не удалось загрузить информацию о фильме');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (!movie && !loading) {
    return <div className="text-center">Фильм не найден</div>;
  }

  return (
    <MoviePosterUpdateForm 
      initialData={movie} 
      pageTitle={`Обновление постера фильма "${movie?.title}"`}
    />
  );
}