package ru.ifmo.is.mfl.movieviews;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class MovieViewPolicy extends CrudPolicy<MovieView> {

  @Override
  public boolean canDelete(User user, MovieView object) {
    return true;
  }

  @Override
  public boolean canUpdate(User user, MovieView object) {
    return false;
  }

  @Override
  public User getCreator(MovieView object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "movie-views";
  }
}
