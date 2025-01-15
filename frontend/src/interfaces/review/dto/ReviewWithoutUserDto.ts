import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import { LocalDate } from "@/types/LocalDate";

export interface ReviewWithoutUserDto extends CrudDto {
  movie: MovieDto;
  visible: boolean;
  text: string;
  rating: number; // 1-10
  date: LocalDate;
  viewedCounter: number;
}