import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { MovieDto } from '@/interfaces/movie/dto/MovieDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface MovieViewDto extends CrudDto {
  user: UserDto;
  movie: MovieDto;
  watchDate: Date;
}
