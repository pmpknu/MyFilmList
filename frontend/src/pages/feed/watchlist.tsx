import MoviePoster from '@/components/MoviePoster';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import FeedService from '@/services/FeedService';
import router from 'next/router';
import { useEffect, useState } from 'react';

const FeedPage = () => {

  const [watchlists, setWatchLists] = useState<WatchListDto[]>([]);

  useEffect(() => {
    FeedService.getRecommendedWatchLists()
      .then((response) => {
        setWatchLists(response.data.content);
      })
      .catch((error) => {
        console.error('Failed to fetch watchlists', error);
      });
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchlists.map((watchlist, index) => (
        <MoviePoster
          key={index}
          posterUrl={watchlist.photo}
          title={watchlist.name}
          handleFunction={() => router.push(`/watchlist/${watchlist.id}`)}
        />
      ))}
    </div>
  );
};

export default FeedPage;
