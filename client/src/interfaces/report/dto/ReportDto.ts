import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface ReportDto extends CrudDto {
  user: UserDto;
  reviewId?: number;
  commentId?: number;
  resolved: boolean;
  issue: string;
  text: string;
  date: Date;
}
