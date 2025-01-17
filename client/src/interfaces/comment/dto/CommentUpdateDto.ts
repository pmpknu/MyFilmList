import { JsonNullable } from 'types/json-nullable';

export interface CommentUpdateDto {
  text: JsonNullable<string>;
  visible?: JsonNullable<boolean>;
}
