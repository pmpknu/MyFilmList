import { MovieDto } from "./MovieDto";

export interface MovieWithAdditionalInfoDto extends MovieDto {
  currentUserRating?: number;
  currentUserViewed?: boolean;
}