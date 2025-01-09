package ru.ifmo.is.mfl.movieviews;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

public interface MovieViewRepository extends CrudRepository<MovieView> {
  Page<MovieView> findAllByUser(User user, Pageable pageable);
  Page<MovieView> findAllByMovie(Movie movie, Pageable pageable);
  Optional<MovieView> findByMovieAndUser(Movie movie, User user);
}
