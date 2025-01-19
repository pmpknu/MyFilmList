// MovieGrid.tsx
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import Poster from './Poster'
import { MovieDto } from '@/interfaces/movie/dto/MovieDto'

interface MovieGridProps {
  loading: boolean
  movies: MovieDto[]
  onClick: (id: number) => void
}

export function MovieGrid({ loading, movies, onClick }: MovieGridProps) {
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        <ScrollArea className="h-[66vh] rounded-md border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <Poster
                key={movie.id}
                posterUrl={movie.poster}
                title={movie.title}
                releaseDate={movie.releaseDate}
                onClick={() => onClick(movie.id)}
                width={300}
                height={400}
                aspectRatio='portrait'
              />
            ))}

            {movies.length === 0 && !loading && (
              <p className="text-center text-gray-500">
                {movies.length === 0 ? 'Фильмы не найдены' : 'Попробуйте еще раз'}
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </>
  )
}