import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface RatingWithoutMovieDto extends CrudDto {
  user: UserDto;
  value: number; // 1-10
}
