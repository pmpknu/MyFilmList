package ru.ifmo.is.mfl.movies;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.watchlists.WatchList;

@Component
@RequiredArgsConstructor
public class MovieSpecification {

  public Specification<Movie> belongsToWatchList(int watchListId) {
    return (root, query, cb) -> {
      if (query == null) {
        throw new IllegalArgumentException("CriteriaQuery must not be null");
      }

      var subquery = query.subquery(Long.class);
      var watchListRoot = subquery.from(WatchList.class);
      var movieJoin = watchListRoot.join("movies");

      subquery.select(movieJoin.get("id"))
        .where(cb.equal(watchListRoot.get("id"), watchListId));

      return cb.in(root.get("id")).value(subquery);
    };
  }
}
