package ru.ifmo.is.mfl.ratings;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

public interface RatingRepository extends CrudRepository<Rating> {
  Page<Rating> findAllByUser(User user, Pageable pageable);
  Page<Rating> findAllByMovie(Movie movie, Pageable pageable);
  Optional<Rating> findByMovieAndUser(Movie movie, User user);
}
