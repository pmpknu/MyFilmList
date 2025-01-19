import { Role } from '@/interfaces/role/model/UserRole';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export const isUser = (user: UserDto) => user.roles.includes(Role.ROLE_USER);

export const isAdmin = (user: UserDto) => user.roles.includes(Role.ROLE_ADMIN);

export const isModerator = (user: UserDto) => user.roles.includes(Role.ROLE_MODERATOR);

export const isExactlyModerator = (user: UserDto) =>
  user.roles.includes(Role.ROLE_MODERATOR) && !user.roles.includes(Role.ROLE_ADMIN);
