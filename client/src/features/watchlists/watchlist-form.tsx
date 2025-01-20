'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import WatchListPoster from '@/features/movies/schemas/Poster';
import WatchListService from '@/services/WatchListService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { MovieGrid } from '../movies/schemas/MovieGrid';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Delete, Edit, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const WatchlistForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const [watchlist, setWatchlist] = useState<WatchListDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<MovieDto[]>([]);

  useEffect(() => {
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;

    setLoading(true);
    WatchListService.getWatchListById(watchlistId)
      .then((responseWatchlist) => {
        setWatchlist(responseWatchlist.data);
        WatchListService.getMoviesInWatchList(watchlistId).then((responseMovies) => {
          setMovies(responseMovies.data.content);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Failed to fetch watchlist details', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary' />
      </div>
    );
  }

  if (!watchlist) return <div className='text-center'>No watchlist found</div>;

  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  const handleEdit = () => {
    router.push(`/watchlists/update/${watchlist.id}`);
    toast.success('Редактирование коллекции');
  };

  const handleDelete = () => {
    WatchListService.deleteWatchList(watchlist.id)
      .then(() => {
        toast.success('Коллекция удалена');
        router.push('/watchlists');
      })
      .catch((error) => {
        console.error('Failed to delete watchlist', error);
        toast.error('Не удалось удалить коллекцию');
      });
  }

  return (
    <Card className='container mb-6 border relative'>
      <CardTitle className='ml-4 mt-4'>
        <h2 className='text-2xl font-bold'>{watchlist.name}</h2>
        <div className='absolute right-4 top-4 flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <MoreVertical />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-background border border-border rounded-md p-2'>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className='mr-2 h-4 w-4 text-blue-600'/>
              <span>Настройки коллекции</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Delete className='mr-2 h-4 w-4 text-red-600'/>
              <span>Удалить коллекцию</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </CardTitle>
      <CardHeader className='flex flex-row gap-6'>
        <WatchListPoster
          posterUrl={watchlist.photo}
          title={watchlist.name}
          width={300}
          height={300}
          showTitle={false}
          aspectRatio='square'
          onClick={() => router.push(`/watchlists/update/${watchlist.id}/poster`)}
        />
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='container mx-auto p-4'>
          <MovieGrid loading={loading} movies={movies} onClick={handleMovieClick} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistForm;
