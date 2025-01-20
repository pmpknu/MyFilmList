'use client';

import React from 'react';
import { Role } from '@/interfaces/role/model/UserRole';
import { RootState } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import InputWatchListInfo from './schemas/InputWatchListForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WatchListCreateDto } from '@/interfaces/watchlist/dto/WatchListCreateDto';
import { useSelector } from 'react-redux';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import WatchListService from '@/services/WatchListService';

export default function WatchlistCreateForm({ className, ...props }: React.ComponentProps<'div'>) {
  const isUserAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    if (!isUserAuthenticated) {
      toast.error('Для создания коллекции необходимо войти в аккаунт');
      router.push(callbackUrl ?? '/auth/sign-in');
    }
    console.log('User is auth-ed:', isUserAuthenticated);
  }, [router, isUserAuthenticated]);

  const [watchlist, setWatchlist] = React.useState<WatchListDto>();

  const handleWatchlistSubmit = (data: WatchListCreateDto) => {
    console.log('Submitting data:', data);
    WatchListService.createWatchList(data)
      .then((response) => {
        setWatchlist(response.data);
        router.push(`/watchlists/update/${watchlist?.id}/poster`);
        toast.success('Коллекция успешно создана');
      })
      .catch((error) => {
        console.error('Failed to create watchlist', error);
        toast.error('Не удалось создать коллекцию');
      });
  };

  return (
    <>
      <ScrollArea className='h-[66vh] rounded-md border'>
        <InputWatchListInfo onSubmit={handleWatchlistSubmit} />
      </ScrollArea>
    </>
  );
}
