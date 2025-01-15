import { JsonNullable } from "@/types/JsonNullable";
import { LocalDate } from "@/types/LocalDate";

export interface MovieUpdateDto {
  title: JsonNullable<string>;
  description?: JsonNullable<string>;
  releaseDate?: JsonNullable<LocalDate>;
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