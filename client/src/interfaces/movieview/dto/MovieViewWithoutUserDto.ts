import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';

export interface MovieViewWithoutUserDto extends CrudDto {
  movie: MovieDto;
  watchDate: Date;
}
