import Image from 'next/image';
import { PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Card } from '@/components/ui/card';

export interface MoviePosterProps extends React.HTMLAttributes<HTMLDivElement> {
  posterUrl: string | undefined;
  title: string;
  movieid?: number;
  aspectRatio?: 'portrait' | 'square';
  width?: number;
  height?: number;
  releaseDate?: string;
  showTitle?: boolean;
  renderContextMenu?: boolean;
  onNewWatchlist?: (movieId: number) => void;
  onMarkAsWatched?: (movieId: number) => void;
  onAddToWatchlist?: (movieId: number, watchlistId: number) => void;
  watchlists?: { id: number; name: string }[];
}

const Poster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title,
  movieid,
  aspectRatio,
  width,
  height,
  releaseDate,
  className,
  showTitle = true,
  renderContextMenu = false,
  onNewWatchlist,
  onMarkAsWatched,
  onAddToWatchlist,
  watchlists = [],
  ...props
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className={cn(
              `h-[${height}px] w-[${width}px]`,
              'col-span-12 overflow-hidden rounded-lg sm:col-span-4'
            )}
          >
            <div className='overflow-hidden rounded-lg'>
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  width={width}
                  height={height}
                  className={cn(
                    'z-0 h-full w-full object-cover transition-all hover:scale-105',
                    aspectRatio === 'portrait'
                      ? 'aspect-[3/4]'
                      : aspectRatio === 'square'
                        ? 'aspect-square'
                        : ''
                  )}
                />
              ) : (
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center bg-gray-300 hover:scale-105',
                    aspectRatio === 'portrait'
                      ? 'aspect-[3/4]'
                      : aspectRatio === 'square'
                        ? 'aspect-square'
                        : ''
                  )}
                >
                  <span className='text-center text-lg text-gray-600'>{title}</span>
                </div>
              )}
            </div>
          </Card>
        </ContextMenuTrigger>
        {renderContextMenu && movieid && (
          <ContextMenuContent className='w-40'>
            {onMarkAsWatched && (
              <ContextMenuItem onClick={() => onMarkAsWatched(movieid)}>
                Отметить просмотренным
              </ContextMenuItem>
            )}
            <ContextMenuSub>
              <ContextMenuSubTrigger>Добавить в коллекцию</ContextMenuSubTrigger>
              <ContextMenuSubContent className='w-48'>
                {onNewWatchlist && (
                  <ContextMenuItem onClick={() => onNewWatchlist(movieid)}>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Новая коллекция
                  </ContextMenuItem>
                )}
                <ContextMenuSeparator />
                {onAddToWatchlist &&
                  watchlists.map((playlist) => (
                    <ContextMenuItem
                      key={playlist.id}
                      onClick={() => onAddToWatchlist(movieid, playlist.id)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='mr-2 h-4 w-4'
                        viewBox='0 0 24 24'
                      >
                        <path d='M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3' />
                      </svg>
                      {playlist.name}
                    </ContextMenuItem>
                  ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        )}
      </ContextMenu>
      {showTitle && (
        <div className='space-y-1 text-sm'>
          <h3 className='font-medium leading-none'>{title}</h3>
          {releaseDate && (
            <p className='text-xs text-muted-foreground'>{releaseDate.split('-')[0]}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Poster;
