import { JsonNullable } from 'types/json-nullable';

export interface MovieUpdateDto {
  title: JsonNullable<string>;
  description?: JsonNullable<string>;
  releaseDate?: JsonNullable<Date>;
  duration?: JsonNullable<number>;
  categories?: JsonNullable<string>;
  tags?: JsonNullable<string>;
  productionCountry?: JsonNullable<string>;
  genres?: JsonNullable<string>;
  actors?: JsonNullable<string>;
  director?: JsonNullable<string>;
  seasons?: JsonNullable<number>;
  series?: JsonNullable<number>;
}
