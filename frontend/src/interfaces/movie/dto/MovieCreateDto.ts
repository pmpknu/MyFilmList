import { LocalDate } from "@/types/LocalDate";

export interface MovieCreateDto {
  title: string;
  description?: string;
  releaseDate?: LocalDate;
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
