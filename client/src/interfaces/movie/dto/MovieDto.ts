import { CrudDto } from '@/interfaces/crud/dto/CrudDto';

export interface MovieDto extends CrudDto {
  title: string;
  description: string;
  poster: string;
  releaseDate?: Date;
  duration?: number;
  rating?: number;
  categories?: string;
  tags?: string;
  productionCountry?: string;
  genres?: string;
  actors?: string;
  director?: string;
  seasons?: number;
  series?: number;
}
