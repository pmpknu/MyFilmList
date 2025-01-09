package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class WatchListDto extends CrudDto {
  private int id;
  private User user;
  private String name;
  private boolean visibility;
  private int viewedCounter;
  private Set<Movie> movies;
}
