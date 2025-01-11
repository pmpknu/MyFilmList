import { CrudDto } from '../../crud/dto/CrudDto';
import { Role } from '../../role/model/UserRole';

export interface UserDto extends CrudDto {
  username: string;
  email: string;
  bio?: string;
  photo?: string;
  roles: Role[];
}
