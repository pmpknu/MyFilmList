import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { DateTime } from "luxon";

export interface MovieViewWithoutMovieDto extends CrudDto {
  user: UserDto;
  watchDate: DateTime;
}