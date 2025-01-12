import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";

export interface RatingWithoutUserDto extends CrudDto {
  movie: MovieDto;
  value: number; // 1-10
}