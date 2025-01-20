import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface CommentDto extends CrudDto {
  user: UserDto;
  reviewId?: number;
  watchListId?: number;
  movieId?: number;
  visible: boolean;
  text: string;
  date: string; // ISO date string
}
