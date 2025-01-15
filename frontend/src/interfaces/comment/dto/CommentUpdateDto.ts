import { JsonNullable } from '@/types/JsonNullable';

export interface CommentUpdateDto {
  text: JsonNullable<string>;
  visible?: JsonNullable<boolean>;
}