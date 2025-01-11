package ru.ifmo.is.mfl.watchlists;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

@Component
@RequiredArgsConstructor
public class WatchListSpecification {

  public Specification<WatchList> withVisible() {
    return (root, query, cb) -> cb.equal(root.get("visibility"), true);
  }

  public Specification<WatchList> withUserCreator(int userId) {
    return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
  }

  public Specification<WatchList> visibleSpecification(User currentUser) {
    var currentUserId = currentUser == null ? -1 : currentUser.getId();
    return withVisible().or(withUserCreator(currentUserId));
  }

  public Specification<WatchList> hasMovie(Movie movie) {
    return (root, query, cb) -> {
      Join<WatchList, Movie> movieJoin = root.join("movies", JoinType.INNER);
      return cb.equal(movieJoin, movie);
    };
  }
}
