package ru.ifmo.is.mfl.movieviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.movies.dto.MovieDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieViewWithoutUserDto extends CrudDto {
  private int id;
  private MovieDto movie;
  private Instant watchDate;
}
