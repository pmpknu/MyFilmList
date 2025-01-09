package ru.ifmo.is.mfl.ratings;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movies.MovieService;
import ru.ifmo.is.mfl.ratings.dto.*;
import ru.ifmo.is.mfl.users.UserService;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Ratings")
public class RatingController {

  private final RatingService service;
  private final UserService userService;
  private final MovieService movieService;

  @GetMapping("/users/{userId}/ratings")
  @Operation(summary = "Получить все оценки фильмов пользователя")
  public ResponseEntity<Page<RatingWithoutUserDto>> userRatings(@PathVariable int userId, @PageableDefault(size = 20) Pageable pageable) {
    var user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

    var ratings = service.getUserRatings(user, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(ratings.getTotalElements()))
      .body(ratings);
  }

  @GetMapping("/movies/{movieId}/ratings")
  @Operation(summary = "Получить все оценки фильма пользователями")
  public ResponseEntity<Page<RatingWithoutMovieDto>> movieRatings(@PathVariable int movieId, @PageableDefault(size = 20) Pageable pageable) {
    var ratings = service.getMovieRatings(getMovie(movieId), pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(ratings.getTotalElements()))
      .body(ratings);
  }

  @PostMapping("/movies/{movieId}/ratings")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Оценить фильм", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<RatingDto> create(@PathVariable int movieId, @Valid @RequestBody RatingCreateDto dto) {
    var rating = service.create(getMovie(movieId), dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(rating);
  }

  @PatchMapping("/movies/{movieId}/ratings")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Изменить оценку фильма по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<RatingDto> update(@PathVariable int movieId, @Valid @RequestBody RatingUpdateDto dto) {
    var rating = service.update(getMovie(movieId), dto);
    return ResponseEntity.ok(rating);
  }

  @DeleteMapping("/movies/{movieId}/ratings")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить оценку фильма", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int movieId) {
    if (service.delete(getMovie(movieId))) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  private Movie getMovie(int movieId) {
    return movieService
      .findById(movieId)
      .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
  }
}
