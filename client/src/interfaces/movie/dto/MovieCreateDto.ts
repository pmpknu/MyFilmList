export interface MovieCreateDto {
  title: string;
  description?: string;
  releaseDate?: string; // ISO 8601
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
