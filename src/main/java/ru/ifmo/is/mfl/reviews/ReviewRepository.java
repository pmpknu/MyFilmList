package ru.ifmo.is.mfl.reviews;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

public interface ReviewRepository extends CrudRepository<Review> {
  Optional<Review> findByMovieAndUser(Movie movie, User user);
}
