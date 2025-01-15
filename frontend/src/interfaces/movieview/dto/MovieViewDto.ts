import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { LocalDate } from "@/types/LocalDate";

export interface MovieViewDto extends CrudDto {
  user: UserDto;
  movie: MovieDto;
  watchDate: LocalDate;
}