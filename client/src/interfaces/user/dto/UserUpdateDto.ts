import { JsonNullable } from 'types/json-nullable';

export interface UserUpdateDto {
  username: JsonNullable<string>;
  currentPassword: JsonNullable<string>;
  newPassword: JsonNullable<string>;
  email: JsonNullable<string>;
  bio: JsonNullable<string>;
}
