import { JsonNullable } from "@/types/JsonNullable";
import { DateTime } from "luxon";

export interface MovieUpdateDto {
  title: JsonNullable<string>;
  description?: JsonNullable<string>;
  releaseDate?: JsonNullable<DateTime>;
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