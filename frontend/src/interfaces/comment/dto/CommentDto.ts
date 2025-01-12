import { CrudDto } from '../../crud/dto/CrudDto';
import { UserDto } from '../../user/dto/UserDto';
import { DateTime } from 'luxon';

export interface CommentDto extends CrudDto {
    user: UserDto;
    reviewId?: number;
    watchListId?: number;
    movieId?: number;
    visible: boolean;
    text: string;
    date: DateTime; 
  }