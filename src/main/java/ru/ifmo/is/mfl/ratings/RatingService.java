package ru.ifmo.is.mfl.ratings;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.ResourceAlreadyExists;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movieviews.MovieViewService;
import ru.ifmo.is.mfl.ratings.dto.*;
import ru.ifmo.is.mfl.users.User;

@Service
@RequiredArgsConstructor
public class RatingService extends ApplicationService {

  private final RatingMapper mapper;
  private final RatingPolicy policy;
  private final RatingRepository repository;

  private final MovieViewService movieViewService;

  public Page<RatingWithoutUserDto> getUserRatings(User user, Pageable pageable) {
    policy.showAll(currentUser());

    var movies = repository.findAllByUser(user, pageable);
    return movies.map(mapper::mapNoUsers);
  }

  public Page<RatingWithoutMovieDto> getMovieRatings(Movie movie, Pageable pageable) {
    policy.showAll(currentUser());

    var movies = repository.findAllByMovie(movie, pageable);
    return movies.map(mapper::mapNoMovies);
  }

  @Transactional
  public RatingDto create(Movie movie, RatingCreateDto dto) {
    policy.create(currentUser());

    if (repository.findByMovieAndUser(movie, currentUser()).isPresent()) {
      throw new ResourceAlreadyExists("This movie is already rated");
    }

    var rating = Rating.builder()
      .user(currentUser())
      .movie(movie)
      .value(dto.getValue())
      .build();

    movieViewService.watchMovie(movie);
    movie.incrementRatedCounter();

    return mapper.map(repository.save(rating));
  }

  @Transactional
  public RatingDto update(Movie movie, RatingUpdateDto dto) {
    var rating = repository
      .findByMovieAndUser(movie, currentUser())
      .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

    policy.update(currentUser(), rating);

    mapper.update(dto, rating);
    return mapper.map(repository.save(rating));
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(Movie movie) {
    var rating = repository.findByMovieAndUser(movie, currentUser());

    return rating.map(o -> {
      policy.delete(currentUser(), o);
      movie.decrementRatedCounter();
      repository.delete(o);
      return true;
    }).orElse(false);
  }
}
