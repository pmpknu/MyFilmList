// WatchlistGrid.tsx
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import Poster from '@/features/movies/schemas/Poster';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';

interface WatchlistGridProps {
  loading: boolean;
  watchlists: WatchListDto[];
  onClick: (id: number) => void;
}

export function WatchListGrid({ loading, watchlists, onClick }: WatchlistGridProps) {
  return (
    <>
      {loading ? (
        <div className='flex justify-center'>
          <Spinner size='large' />
        </div>
      ) : (
        <ScrollArea className='h-[66vh] rounded-md border'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {watchlists.map((watchlist) => (
              <Poster
                key={watchlist.id}
                posterUrl={watchlist.photo}
                title={watchlist.name}
                onClick={() => onClick(watchlist.id)}
                width={225}
                height={225}
                aspectRatio='square'
              />
            ))}

            {watchlists.length === 0 && !loading && (
              <p className='text-center text-gray-500'>
                {watchlists.length === 0 ? 'Коллекции не найдены' : 'Попробуйте еще раз'}
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
