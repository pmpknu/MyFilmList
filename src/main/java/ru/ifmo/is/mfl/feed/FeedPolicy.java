package ru.ifmo.is.mfl.feed;

import org.springframework.stereotype.Component;
import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

@Component
public class FeedPolicy extends CrudPolicy<Movie> {

  @Override
  public User getCreator(Movie object) {
    throw new UnsupportedOperationException();
  }

  @Override
  public String getPolicySubject() {
    return "feed";
  }
}
