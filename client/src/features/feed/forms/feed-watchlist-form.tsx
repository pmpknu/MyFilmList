'use client';
import React, { useEffect, useState } from 'react';
import FeedService from '@/services/FeedService';
import { WatchListGrid } from '@/features/watchlists/schemas/WatchListGrid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';

export const FeedWatchListForm: React.FC = () => {
  const [watchlists, setWatchlists] = useState<WatchListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRecommendedWatchlists();
  }, []);

  const loadRecommendedWatchlists = async () => {
    try {
      setIsLoading(true);
      const response = await FeedService.getRecommendedWatchLists();
      setWatchlists(response.data.content);
    } catch (error) {
      toast.error('Не удалось загрузить рекомендованные коллекции');
      console.error('Error loading recommended watchlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchlistClick = (watchlistId: number) => {
    router.push(`/watchlists/${watchlistId}`);
  };

  return (
    <div className='feed-watchlist-form'>
      {watchlists.length === 0 ? (
        <p>No recommended watchlists found</p>
      ) : (
        <WatchListGrid watchlists={watchlists} loading={isLoading} onClick={handleWatchlistClick} />
      )}
    </div>
  );
};
