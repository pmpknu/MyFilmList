package ru.ifmo.is.mfl.movies.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieWithAdditionalInfoDto extends MovieDto {
  private Integer currentUserRating;
  private Boolean currentUserViewed;
}
