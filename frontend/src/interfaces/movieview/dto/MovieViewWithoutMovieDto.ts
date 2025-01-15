import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { LocalDate } from "@/types/LocalDate";

export interface MovieViewWithoutMovieDto extends CrudDto {
  user: UserDto;
  watchDate: LocalDate;
}