import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import UploadPhotoModal from "@/components/UploadPhotoModal";
import MovieService from "@/services/MovieService";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import InputMovieInfo from "@/components/InputMovieInfo";
import { useRouter } from "next/router";
import { MovieUpdateDto } from "@/interfaces/movie/dto/MovieUpdateDto";
import MoviePoster from "@/components/MoviePoster";

const UpdateMoviePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [movie, setMovie] = React.useState<MovieDto>();
  const [loading, setLoading] = React.useState(true);

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

  const handlePhotoSave = async () => {
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        if (!movie) {
          console.error("Movie not found");
        } else {
          const response = await MovieService.uploadMoviePoster(movie.id, formData);
          setMovie(response.data);
          router.push(`/movie/${movie.id}`);
        }

        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to upload photo", error);
      }
    }
  };

  const handleMovieSubmit = (data: MovieUpdateDto) => {
    if (!id) return;
    const movieId = parseInt(String(id));
    if (!movieId) return;
    MovieService.updateMovie(movieId, data)
      .then((response) => {
        setMovie(response.data);
        router.push(`/movie/${movieId}`);
      })
      .catch((error) => {
        console.error("Failed to create movie", error);
      });
  };

  if (!movie) return <div>No movie found</div>;

  return (
    <>
     <h2>Update Movie</h2>
    <Card>
      <CardHeader>
        <MoviePoster
          posterUrl={movie.poster}
          title={movie.title}
          handleFunction={() => setIsModalOpen(true)}
        />
      </CardHeader>
      <InputMovieInfo onSubmit={handleMovieSubmit} initialData={movie} />
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        handlePhotoSave={handlePhotoSave}
      />
    </Card>
    </>
  );
};

export default UpdateMoviePage;
