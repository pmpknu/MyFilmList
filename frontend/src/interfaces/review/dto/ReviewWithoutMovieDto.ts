import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { LocalDate } from "@/types/LocalDate";

export interface ReviewWithoutMovieDto extends CrudDto {
  user: UserDto;
  visible: boolean;
  text: string;
  rating: number; // 1-10
  date: LocalDate;
  viewedCounter: number;
}