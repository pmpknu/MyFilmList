// MovieGrid.tsx
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import Poster from './Poster';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';

interface MovieGridProps {
  loading: boolean;
  movies: MovieDto[];
  onClick: (id: number) => void;
  renderContextMenu?: boolean;
  onNewWatchlist?: (movieId: number) => void;
  onMarkAsWatched?: (movieId: number) => void;
  onAddToWatchlist?: (movieId: number, watchlistId: number) => void;
  watchlists?: {id:number, name:string}[];
}

export function MovieGrid({ loading, movies, onClick, renderContextMenu, onMarkAsWatched, onAddToWatchlist, watchlists, onNewWatchlist }: MovieGridProps) {
  return (
    <>
      {loading ? (
        <div className='flex justify-center'>
          <Spinner size='large' />
        </div>
      ) : (
        <ScrollArea className='h-[66vh] rounded-md border'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {movies.map((movie) => (
              <Poster
                key={movie.id}
                posterUrl={movie.poster}
                title={movie.title}
                movieid={movie.id}
                releaseDate={movie.releaseDate}
                onClick={() => onClick(movie.id)}
                width={225}
                height={500}
                aspectRatio='portrait'
                renderContextMenu={renderContextMenu}
                onAddToWatchlist={onAddToWatchlist}
                watchlists={watchlists}
                onMarkAsWatched={onMarkAsWatched}
                onNewWatchlist={onNewWatchlist}
              />
            ))}

            {movies.length === 0 && !loading && (
              <p className='text-center text-gray-500'>
                {movies.length === 0 ? 'Фильмы не найдены' : 'Попробуйте еще раз'}
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
