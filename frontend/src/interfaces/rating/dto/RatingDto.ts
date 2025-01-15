import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";

export interface RatingDto extends CrudDto {
  user: UserDto;
  movie: MovieDto;
  value: number; // 1-10
}