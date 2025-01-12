import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { DateTime } from "luxon";

export interface ReviewWithoutUserDto extends CrudDto {
  movie: MovieDto;
  visible: boolean;
  text: string;
  rating: number; // 1-10
  date: DateTime;
  viewedCounter: number;
}