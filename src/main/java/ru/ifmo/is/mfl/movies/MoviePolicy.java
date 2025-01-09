package ru.ifmo.is.mfl.movies;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class MoviePolicy extends CrudPolicy<Movie> {

  @Override
  public boolean canCreate(User user) {
    return user.isAdmin();
  }

  @Override
  public boolean canDelete(User user, Movie object) {
    return user.isAdmin();
  }

  @Override
  public boolean canUpdate(User user, Movie object) {
    return user.isAdmin();
  }

  @Override
  public User getCreator(Movie object) {
    throw new UnsupportedOperationException();
  }

  @Override
  public String getPolicySubject() {
    return "movies";
  }
}
