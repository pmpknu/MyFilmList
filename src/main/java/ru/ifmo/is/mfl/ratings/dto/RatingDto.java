package ru.ifmo.is.mfl.ratings.dto;

import lombok.*;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.movies.dto.MovieDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class RatingDto extends CrudDto {
  private int id;
  private UserDto user;
  private MovieDto movie;
  private int value;
}
