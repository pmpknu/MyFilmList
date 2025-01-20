'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { RootState } from '@/store';
import { Role } from '@/interfaces/role/model/UserRole';
import WatchlistService from '@/services/WatchListService';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import WatchlistPosterUpdateForm from '../watchlist-update-poster-form';

export default function WatchlistPosterUpdateViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchListDto | null>(null);
  const [loading, setLoading] = useState(true);

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isUserAdmin = useSelector(
    (state: RootState) => !!state.auth.user?.roles.includes(Role.ROLE_ADMIN)
  );

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для обновления карткинки коллекции');
      router.push('/');
    } else if (!isUserAuthenticated) {
      toast.error('Для обновления картинки коллекции необходимо войти в аккаунт');
      router.push('/auth/sign-in');
    }
  }, [isUserAuthenticated, isUserAdmin, router]);

  useEffect(() => {
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;

    setLoading(true);
    WatchlistService.getWatchListById(watchlistId)
      .then((response) => {
        setWatchlist(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch watchlist details:', error);
        toast.error('Не удалось загрузить информацию о коллекции');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (!watchlist && !loading) {
    return <div className='text-center'>Фильм не найден</div>;
  }

  return (
    <WatchlistPosterUpdateForm
      initialData={watchlist}
      pageTitle={`Обновление постера фильма "${watchlist?.name}"`}
    />
  );
}
