import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { DateTime } from "luxon";

export interface ReviewDto extends CrudDto {
  user: UserDto;
  movie: MovieDto;
  visible: boolean;
  text: string;
  rating: number; // 1-10
  date: DateTime
  viewedCounter: number;
}