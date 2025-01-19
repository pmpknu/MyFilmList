'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Role } from '@/interfaces/role/model/UserRole';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MovieService from '@/services/MovieService';
import { MovieWithAdditionalInfoDto } from '@/interfaces/movie/dto/MovieWithAdditionalInfoDto';
import { Input } from '@/components/ui/input';
import Paged from '@/interfaces/paged/models/Paged';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';
import { MovieGrid } from '@/features/movies/schemas/MovieGrid';

export default function MoviesUpdateSearchForm() {
  const router = useRouter();
  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isUserAdmin = useSelector(
    (state: RootState) => !!(state.auth.user?.roles.includes(Role.ROLE_ADMIN))
  );

  const [movies, setMovies] = useState<MovieWithAdditionalInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для редактирования фильмов');
      router.push('/');
    } else if (!isUserAuthenticated) {
      toast.error('Для редактирования фильмов необходимо войти в аккаунт');
      router.push('/auth/sign-in');
    }
  }, [isUserAuthenticated, isUserAdmin, router]);

  const searchMovies = async (query: string) => {
    setLoading(true);
    try {
      const searchParams: SearchDto = {
        dataOption: 'all',
        searchCriteriaList: [
          {
            filterKey: 'title',
            operation: 'cn',
            value: query,
          },
        ],
      };
      
      const response = await MovieService.searchMovies(searchParams);
      const pagedResponse = response.data as Paged<MovieWithAdditionalInfoDto>;
      setMovies(pagedResponse.content);
    } catch (error) {
      console.error('Failed to search movies:', error);
      toast.error('Ошибка при поиске фильмов');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      searchMovies(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/update/${movieId}`);
  };

  if (!isUserAuthenticated || !isUserAdmin) {
    return null;
  }

  return (
    <>
    <Input
        type="search"
        placeholder="Поиск фильмов..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="mb-4"
      />
    <div className="container mx-auto p-4">
      <MovieGrid
        loading={loading}
        movies={movies}
        onClick={handleMovieClick}
      />
    </div>
    </>
  );
}