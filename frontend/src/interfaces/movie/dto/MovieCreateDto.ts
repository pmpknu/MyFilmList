import { DateTime } from "luxon";

export interface MovieCreateDto {
  title: string;
  description?: string;
  releaseDate?: DateTime
  duration?: number;
  categories?: string;
  tags?: string;
  productionCountry?: string;
  genres?: string;
  actors?: string;
  director?: string;
  seasons?: number;
  series?: number;
}
