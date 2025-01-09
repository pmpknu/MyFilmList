package ru.ifmo.is.mfl.movieviews;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.movies.MovieService;
import ru.ifmo.is.mfl.movieviews.dto.*;
import ru.ifmo.is.mfl.users.UserService;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Movie Views")
public class MovieViewController {

  private final MovieViewService service;
  private final UserService userService;
  private final MovieService movieService;

  @GetMapping("/users/{userId}/views")
  @Operation(summary = "Получить все просмотры пользователя")
  public ResponseEntity<Page<MovieViewWithoutUserDto>> userViews(@PathVariable int userId, @PageableDefault(size = 20) Pageable pageable) {
    var user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

    var views = service.getUserViews(user, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(views.getTotalElements()))
      .body(views);
  }

  @GetMapping("/movies/{movieId}/views")
  @Operation(summary = "Получить все просмотры фильма")
  public ResponseEntity<Page<MovieViewWithoutMovieDto>> movieViews(@PathVariable int movieId, @PageableDefault(size = 20) Pageable pageable) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));

    var views = service.getMovieViews(movie, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(views.getTotalElements()))
      .body(views);
  }

  @PostMapping("/movies/{movieId}/views")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Отметить фильм просмотренным", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<MovieViewDto> markWatched(@PathVariable int movieId) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));

    var view = service.markWatched(movie);
    return ResponseEntity.status(HttpStatus.CREATED).body(view);
  }

  @DeleteMapping("/movies/{movieId}/views")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Убрать отметку фильма просмотренным", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> markUnwatched(@PathVariable int movieId) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));

    if (service.markUnwatched(movie)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
