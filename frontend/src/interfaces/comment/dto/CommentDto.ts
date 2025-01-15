import { LocalDate } from '@/types/LocalDate';
import { CrudDto } from '../../crud/dto/CrudDto';
import { UserDto } from '../../user/dto/UserDto';

export interface CommentDto extends CrudDto {
    user: UserDto;
    reviewId?: number;
    watchListId?: number;
    movieId?: number;
    visible: boolean;
    text: string;
    date: LocalDate; 
  }