import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface MovieViewWithoutMovieDto extends CrudDto {
  user: UserDto;
  watchDate: Date;
}
