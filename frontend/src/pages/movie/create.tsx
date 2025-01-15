import React from "react";
import { Card } from "@nextui-org/react";
import UploadPhotoModal from "@/components/UploadPhotoModal";
import MovieService from "@/services/MovieService";
import { MovieCreateDto } from "@/interfaces/movie/dto/MovieCreateDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import InputMovieInfo from "@/components/InputMovieInfo";
import router from "next/router";


const CreateMoviePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [movie, setMovie] = React.useState<MovieDto>();

  const handlePhotoSave = async () => {
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        if (!movie) {
          const createdMovie = await MovieService.createMovie  ({title: ""} as MovieCreateDto);
          setMovie(createdMovie.data);
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

  const handleMovieSubmit = (data: MovieCreateDto) => {
    MovieService.createMovie(data)
      .then((response) => {
        setMovie(response.data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Failed to create movie", error);
      });
  };

  return (
    <Card>
      <h2>Create Movie</h2>
      <InputMovieInfo onSubmit={handleMovieSubmit}/>
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        handlePhotoSave={handlePhotoSave}
      />
    </Card>
  );
};

export default CreateMoviePage;
