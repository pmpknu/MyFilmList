import MoviePoster from '@/components/MoviePoster';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import MovieService from '@/services/MovieService';
import { Card, CardBody, CardHeader, Chip, Spacer, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
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

  if (loading) return <Spinner color="warning" label="Loading..." />; 

  if (!movie) return <div>No movie found</div>;

  const renderChips = (itemsString?: string, label?: string) => {
    if (!itemsString || itemsString.trim() === '') return null;

    const items = itemsString.split(',').map((item) => item.trim());
    return (
      <div>
        <h4>{label}</h4>
        <div className="flex gap-2 flex-wrap">
          {items.map((item, index) => (
            <Chip key={index} variant="flat">
              {item}
            </Chip>
          ))}
        </div>
        <Spacer y={1} />
      </div>
    );
  };

  return (
    <Card style={{ marginLeft: '20px' }}>
      <CardHeader>
        { movie.poster && (
        <MoviePoster
          posterUrl={movie.poster}
          title={movie.title}
          handleFunction={() => {}}
        />
        )}
      </CardHeader>
      <CardBody>
      {!movie.poster && movie.title && <h4>Title: {movie.title}</h4>}
      {movie.description && <p>Description: {movie.description}</p>}
      {movie.releaseDate && (
      <p>
        Release Date: {new Date(movie.releaseDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        })}
      </p>
      )}
      {movie.duration && <p>Duration: {movie.duration} minutes</p>}
      {movie.rating && <p>Rating: {movie.rating}/10</p>}

      {renderChips(movie.categories, 'Categories')}
      {renderChips(movie.tags, 'Tags')}
      {renderChips(movie.productionCountry, 'Production Countries')}
      {renderChips(movie.genres, 'Genres')}
      {renderChips(movie.actors, 'Actors')}
      {renderChips(movie.director, 'Directors')}

      {movie.seasons !== undefined && movie.seasons > 0 && <p>Seasons: {movie.seasons}</p>}
      {movie.series !== undefined && movie.series > 0 && <p>Series: {movie.series}</p>}

      </CardBody>
    </Card>
  );
};

export default MovieDetail;
