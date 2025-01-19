"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import MovieService from '@/services/MovieService';
import MoviePoster from './schemas/Poster';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const MovieForm = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const movieId = parseInt(String(id));
    if (!movieId) return;

    setLoading(true);
    MovieService.getMovieById(movieId)
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch movie details', error);
        setLoading(false);
      });
  }, [id]);

  const renderBadges = (itemsString?: string, label?: string) => {
    if (!itemsString || itemsString.trim() === '') return null;

    const items = itemsString.split(',').map((item) => item.trim());
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!movie) return <div className="text-center">No movie found</div>;

  return (
  <ScrollArea className="h-[66vh] rounded-md border">
    <Card className="max-w-4xl mx-auto m-4">
      <CardTitle className="ml-4 mt-4">
        <h2 className="text-2xl font-bold">{movie.title}</h2>
      </CardTitle>
      <CardHeader className="flex flex-row gap-6">
        <MoviePoster
            posterUrl={movie.poster}
            title={movie.title}
            width={300}
            height={400}
            showTitle={false}
            aspectRatio='portrait'
        />
        <div className="space-y-2">
          {movie.releaseDate && (
            <p className="text-sm text-muted-foreground">
              Released: {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {movie.duration && (
            <p className="text-sm text-muted-foreground">
              Duration: {movie.duration} minutes
            </p>
          )}
          {movie.rating && (
            <p className="text-sm text-muted-foreground">
              Rating: {movie.rating}/10
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
            {movie.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {movie.description}
                </p>
              </div>
            )}
            
            <Separator />

            {renderBadges(movie.categories, 'Categories')}
            {renderBadges(movie.tags, 'Tags')}
            {renderBadges(movie.productionCountry, 'Production Countries')}
            {renderBadges(movie.genres, 'Genres')}
            {renderBadges(movie.actors, 'Actors')}
            {renderBadges(movie.director, 'Directors')}

            {(movie.seasons !== undefined || movie.series !== undefined) && (
              <>
                <Separator />
                <div className="space-y-2">
                  {movie.seasons !== undefined && movie.seasons > 0 && (
                    <p className="text-sm">Seasons: {movie.seasons}</p>
                  )}
                  {movie.series !== undefined && movie.series > 0 && (
                    <p className="text-sm">Episodes: {movie.series}</p>
                  )}
                </div>
              </>
            )}
          </div>
      </CardContent>
    </Card>
  </ScrollArea>
  );
};

export default MovieForm;