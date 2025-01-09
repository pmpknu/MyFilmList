package ru.ifmo.is.mfl.movieviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieViewWithoutMovieDto extends CrudDto {
  private int id;
  private UserDto user;
  private Instant watchDate;
}
