package ru.ifmo.is.mfl.feed.query;

import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movies.MovieRepository;
import ru.ifmo.is.mfl.movieviews.MovieView;
import ru.ifmo.is.mfl.watchlists.WatchList;
import ru.ifmo.is.mfl.watchlists.WatchListRepository;
import ru.ifmo.is.mfl.watchlists.WatchListSpecification;
import ru.ifmo.is.mfl.users.User;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FeedQuery {

  private final MovieRepository movieRepository;
  private final WatchListRepository watchListRepository;
  private final WatchListSpecification watchListSpecification;

  @Transactional(readOnly = true)
  public Page<Movie> getRecommendedMovies(Pageable pageable, User currentUser) {
    var userId = currentUser != null ? currentUser.getId() : null;
    var limit = pageable.getPageSize();
    var offset = (int) pageable.getOffset();

    List<Movie> movies = movieRepository.findRecommendedMovies(userId, limit, offset);

    return PageableExecutionUtils.getPage(
      movies,
      pageable,
      currentUser == null
        ? movieRepository::count
        : () -> movieRepository.count(notViewedByUser(currentUser))
    );
  }

  @Transactional(readOnly = true)
  public Page<WatchList> getRecommendedWatchLists(Pageable pageable, User currentUser) {
    var userId = currentUser != null ? currentUser.getId() : null;
    var limit = pageable.getPageSize();
    var offset = (int) pageable.getOffset();

    List<WatchList> watchLists = watchListRepository.findRecommendedWatchLists(userId, limit, offset);

    return PageableExecutionUtils.getPage(
      watchLists,
      pageable,
      () -> watchListRepository.count(
        notCreatedByUser(currentUser)
          .and(watchListSpecification.withVisible())
      )
    );
  }

  private Specification<Movie> notViewedByUser(User currentUser) {
    return (root, query, cb) -> {
      if (query == null) {
        throw new IllegalArgumentException("CriteriaQuery must not be null");
      }

      Subquery<Long> subquery = query.subquery(Long.class);
      Root<MovieView> movieViewRoot = subquery.from(MovieView.class);

      subquery.select(movieViewRoot.get("movie").get("id"))
        .where(cb.equal(movieViewRoot.get("user"), currentUser));

      return cb.not(root.get("id").in(subquery));
    };
  }

  private Specification<WatchList> notCreatedByUser(User currentUser) {
    return (root, query, cb) -> cb.notEqual(root.get("user"), currentUser);
  }
}
