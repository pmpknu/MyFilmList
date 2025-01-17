import { JsonNullable } from 'types/json-nullable';

export interface WatchListUpdateDto {
  name: JsonNullable<string>;
  visibility?: JsonNullable<boolean>;
}
