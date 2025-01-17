import { UserDto } from '@/interfaces/user/dto/UserDto';

export interface AuthenticationDto {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
