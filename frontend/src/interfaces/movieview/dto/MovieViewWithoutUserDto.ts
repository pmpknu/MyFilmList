import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { DateTime } from "luxon";

export interface MovieViewWithoutUserDto extends CrudDto {
  movie: MovieDto;
  watchDate: DateTime;
}