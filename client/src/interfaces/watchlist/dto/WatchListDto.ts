import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface WatchListDto extends CrudDto {
  user: UserDto;
  name: string;
  photo?: string;
  visibility: boolean;
  viewedCounter: number;
}
