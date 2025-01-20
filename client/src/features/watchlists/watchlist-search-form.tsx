'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Role } from '@/interfaces/role/model/UserRole';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import WatchlistService from '@/services/WatchListService';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import { Input } from '@/components/ui/input';
import Paged from '@/interfaces/paged/models/Paged';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';
import { WatchListGrid } from '@/features/watchlists/schemas/WatchListGrid';
import WatchListService from '@/services/WatchListService';

export default function WatchListSearchForm() {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const [userWatchlists, setUserWatchlists] = useState<WatchListDto[]>([]);
  const [foundWatchlists, setFoundWatchlists] = useState<WatchListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    WatchListService.getWatchListsForUser(user.id)
      .then((responseWatchlist) => {
        setUserWatchlists(responseWatchlist.data.content);
      })
      .catch((error) => {
        console.error('Failed to fetch watchlist details', error);
        toast.error('Не удалось загрузить информацию о коллекции');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, foundWatchlists]);

  const searchWatchlists = async (query: string) => {
    setLoading(true);
    try {
      const searchParams: SearchDto = {
        dataOption: 'all',
        searchCriteriaList: [
          {
            filterKey: 'name',
            operation: 'cn',
            value: query
          }
        ]
      };

      const response = await WatchlistService.searchWatchLists(searchParams);
      const pagedResponse = response.data as Paged<WatchListDto>;
      setFoundWatchlists(pagedResponse.content);
    } catch (error) {
      console.error('Failed to search watchlists:', error);
      toast.error('Ошибка при поиске коллекций');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      searchWatchlists(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleWatchlistClick = (watchlistId: number) => {
    router.push(`/watchlists/${watchlistId}`);
  };

  return (
    <>
      <Input
        type='search'
        placeholder='Поиск коллекций...'
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className='mb-4'
      />
      <div className='container mx-auto p-4'>
        <WatchListGrid
          loading={loading}
          watchlists={searchQuery !== '' ? foundWatchlists : userWatchlists}
          onClick={handleWatchlistClick}
        />
      </div>
    </>
  );
}
