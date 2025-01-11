package ru.ifmo.is.mfl.movies.query;

import lombok.RequiredArgsConstructor;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;

import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movies.MovieRepository;
import ru.ifmo.is.mfl.movieviews.MovieView;
import ru.ifmo.is.mfl.ratings.Rating;
import ru.ifmo.is.mfl.users.User;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MovieWithAdditionalInfoQuery {

  @PersistenceContext
  private final EntityManager entityManager;

  private final MovieRepository movieRepository;

  @Transactional(readOnly = true)
  public MovieWithAdditionalInfo getMovieWithAdditionalInfo(Movie movie, User currentUser) {
    var userId = currentUser.getId();
    var cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<MovieWithAdditionalInfo> query = cb.createQuery(MovieWithAdditionalInfo.class);
    Root<Movie> movieRoot = query.from(Movie.class);

    query.where(cb.equal(movieRoot.get("id"), movie.getId()));

    addRelatedInfo(userId, cb, query, movieRoot);

    List<MovieWithAdditionalInfo> result = entityManager.createQuery(query).getResultList();

    return result.isEmpty() ? null : result.get(0);
  }

  @Transactional(readOnly = true)
  public Page<MovieWithAdditionalInfo> getMoviesWithAdditionalInfo(
    Specification<Movie> searchSpecification,
    Pageable pageable,
    User currentUser
  ) {
    var userId = currentUser.getId();
    var cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<MovieWithAdditionalInfo> query = cb.createQuery(MovieWithAdditionalInfo.class);
    Root<Movie> movieRoot = query.from(Movie.class);

    // Apply search specification
    if (searchSpecification != null) {
      query.where(searchSpecification.toPredicate(movieRoot, query, cb));
    }

    addRelatedInfo(userId, cb, query, movieRoot);

    // Apply sort from Pageable
    pageable.getSort();
    List<Order> orders = pageable.getSort().stream()
      .map(order -> {
        Path<?> path = movieRoot.get(order.getProperty());
        return order.isAscending() ? cb.asc(path) : cb.desc(path);
      })
      .toList();
    query.orderBy(orders);

    // Paginate
    List<MovieWithAdditionalInfo> moviesWithAdditionalInfo = entityManager.createQuery(query)
      .setFirstResult((int) pageable.getOffset())
      .setMaxResults(pageable.getPageSize())
      .getResultList();

    return PageableExecutionUtils.getPage(
      moviesWithAdditionalInfo,
      pageable,
      () -> movieRepository.count(searchSpecification)
    );
  }

  private void addRelatedInfo(
    int userId,
    CriteriaBuilder cb,
    CriteriaQuery<MovieWithAdditionalInfo> query,
    Root<Movie> movieRoot
  ) {
    // Subquery for taking user's rating
    Subquery<Integer> ratingSubquery = query.subquery(Integer.class);
    Root<Rating> ratingRoot = ratingSubquery.from(Rating.class);
    ratingSubquery.select(ratingRoot.get("value"))
      .where(cb.equal(ratingRoot.get("user").get("id"), userId),
        cb.equal(ratingRoot.get("movie").get("id"), movieRoot.get("id")));

    // Subquery for taking user's view
    Subquery<Boolean> viewedSubquery = query.subquery(Boolean.class);
    Root<MovieView> viewRoot = viewedSubquery.from(MovieView.class);
    viewedSubquery.select(cb.literal(true))
      .where(cb.equal(viewRoot.get("user").get("id"), userId),
        cb.equal(viewRoot.get("movie").get("id"), movieRoot.get("id")));

    query.select(cb.construct(MovieWithAdditionalInfo.class,
      movieRoot,
      ratingSubquery.alias("currentUserRating"),
      viewedSubquery.alias("currentUserViewed")
    ));
  }
}
