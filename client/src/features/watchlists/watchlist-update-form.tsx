'use client';

import React from 'react';
import { Role } from '@/interfaces/role/model/UserRole';
import { RootState } from '@/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import InputWatchListInfo from './schemas/InputWatchListForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import WatchlistService from '@/services/WatchListService';
import { WatchListUpdateDto } from '@/interfaces/watchlist/dto/WatchListUpdateDto';

export default function WatchlistUpdateForm({ className, ...props }: React.ComponentProps<'div'>) {
  const isUserAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isUserAdmin: boolean = useSelector(
    (state: RootState) => !!state.auth.user?.roles.includes(Role.ROLE_ADMIN)
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для обновления фильма');
      router.push(callbackUrl ?? '/');
    } else if (!isUserAuthenticated) {
      toast.error('Для обновления фильма необходимо войти в аккаунт');
      router.push(callbackUrl ?? '/auth/sign-in');
    }
    console.log('User is admin:', isUserAdmin);
    console.log('User is auth-ed:', isUserAuthenticated);
  }, [router, isUserAuthenticated, isUserAdmin]);

  useEffect(() => {
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;

    setLoading(true);
    WatchlistService.getWatchListById(watchlistId)
      .then((response) => {
        setWatchlist(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch watchlist details', error);
        setLoading(false);
      });
  }, [id]);

  const [watchlist, setWatchlist] = React.useState<WatchListDto>();

  const handleWatchlistSubmit = (data: WatchListUpdateDto) => {
    console.log('Submitting data:', data);
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;
    WatchlistService.updateWatchList(watchlistId, data)
      .then((response) => {
        setWatchlist(response.data);
        router.push(`/watchlists/update/${watchlistId}/poster`);
        toast.success('Коллекция успешно обновлена');
      })
      .catch((error) => {
        console.error('Failed to create watchlist', error);
        toast.error('Не удалось обновить фильм');
      });
  };

  if (!watchlist) {
    toast.error('Фильм не найден');
    return (
      <div className='text-center'>
        <h2>Фильм не найден</h2>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className='h-[66vh] rounded-md border'>
        <InputWatchListInfo onSubmit={handleWatchlistSubmit} initialData={watchlist} />
      </ScrollArea>
    </>
  );
}
