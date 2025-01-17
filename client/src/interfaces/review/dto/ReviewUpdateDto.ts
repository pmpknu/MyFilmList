import { JsonNullable } from 'types/json-nullable';

export interface ReviewUpdateDto {
  text: JsonNullable<string>;
  visible: JsonNullable<boolean>;
  rating: JsonNullable<number>; // 1-10
}
