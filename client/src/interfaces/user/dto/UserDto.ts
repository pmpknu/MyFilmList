import { CrudDto } from '@/interfaces/crud/dto/CrudDto';
import { Role } from '@/interfaces/role/model/UserRole';

export interface UserDto extends CrudDto {
  id: number;
  username: string;
  email: string;
  bio?: string;
  photo?: string;
  roles: Role[];
}
