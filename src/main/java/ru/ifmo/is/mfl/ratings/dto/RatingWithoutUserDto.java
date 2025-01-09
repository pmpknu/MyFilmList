package ru.ifmo.is.mfl.ratings.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.movies.dto.MovieDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class RatingWithoutUserDto extends CrudDto {
  private int id;
  private MovieDto movie;
  private int value;
}
