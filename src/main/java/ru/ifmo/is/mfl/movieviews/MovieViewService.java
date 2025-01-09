package ru.ifmo.is.mfl.movieviews;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.ResourceAlreadyExists;
import ru.ifmo.is.mfl.common.framework.ApplicationService;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movieviews.dto.*;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class MovieViewService extends ApplicationService {

  private final MovieViewMapper mapper;
  private final MovieViewPolicy policy;
  private final MovieViewRepository repository;

  public Page<MovieViewWithoutUserDto> getUserViews(User user, Pageable pageable) {
    policy.showAll(currentUser());

    var movies = repository.findAllByUser(user, pageable);
    return movies.map(mapper::mapNoUsers);
  }

  public Page<MovieViewWithoutMovieDto> getMovieViews(Movie movie, Pageable pageable) {
    policy.showAll(currentUser());

    var movies = repository.findAllByMovie(movie, pageable);
    return movies.map(mapper::mapNoMovies);
  }

  @Transactional
  public MovieViewDto markWatched(Movie movie) {
    policy.create(currentUser());

    if (repository.findByMovieAndUser(movie, currentUser()).isPresent()) {
      throw new ResourceAlreadyExists("This movie is already watched");
    }

    var view = MovieView.builder()
      .user(currentUser())
      .movie(movie)
      .watchDate(Instant.now())
      .build();

    return mapper.map(repository.save(view));
  }

  @Transactional
  public void watchMovie(Movie movie) {
    if (repository.findByMovieAndUser(movie, currentUser()).isPresent()) {
      return;
    }

    var view = MovieView.builder()
      .user(currentUser())
      .movie(movie)
      .watchDate(Instant.now())
      .build();

    repository.save(view);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean markUnwatched(Movie movie) {
    var view = repository.findByMovieAndUser(movie, currentUser());

    return view.map(o -> {
      policy.delete(currentUser(), o);
      repository.delete(o);
      return true;
    }).orElse(false);
  }
}
