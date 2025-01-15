import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { LocalDate } from "@/types/LocalDate";

export interface MovieViewWithoutUserDto extends CrudDto {
  movie: MovieDto;
  watchDate: LocalDate;
}