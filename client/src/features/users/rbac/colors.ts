import { UserDto } from '@/interfaces/user/dto/UserDto';
import { isAdmin, isExactlyModerator } from '.';

export const roleBadges = {
  ROLE_USER: 'border-muted',
  ROLE_MODERATOR: 'border-primary bg-primary/10',
  ROLE_ADMIN: 'border-destructive bg-destructive/10'
};

export const roleClasses = (user: UserDto) =>
  isAdmin(user)
    ? 'border-destructive bg-destructive/10'
    : isExactlyModerator(user)
      ? 'border-primary bg-primary/10'
      : 'border-muted';

export const hoverBg = (user: UserDto) =>
  isAdmin(user)
    ? 'hover:border-destructive hover:bg-destructive/20'
    : isExactlyModerator(user)
      ? 'hover:border-primary hover:bg-primary/30'
      : 'hover:border-muted hover:bg-muted/50';
