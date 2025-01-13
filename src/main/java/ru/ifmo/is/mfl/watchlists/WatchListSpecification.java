package ru.ifmo.is.mfl.watchlists;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.application.VisibleSpecification;
import ru.ifmo.is.mfl.movies.Movie;

@Component
@RequiredArgsConstructor
public class WatchListSpecification extends VisibleSpecification<WatchList> {

  @Override
  public Specification<WatchList> withVisible() {
    return (root, query, cb) -> cb.equal(root.get("visibility"), true);
  }

  public Specification<WatchList> hasMovie(Movie movie) {
    return (root, query, cb) -> {
      Join<WatchList, Movie> movieJoin = root.join("movies", JoinType.INNER);
      return cb.equal(movieJoin, movie);
    };
  }
}
