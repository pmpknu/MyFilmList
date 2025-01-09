package ru.ifmo.is.mfl.movieviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieViewDto extends CrudDto {
  private int id;
  private User user;
  private Movie movie;
  private Instant watchDate;
}
