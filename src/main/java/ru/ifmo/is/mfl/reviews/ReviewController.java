package ru.ifmo.is.mfl.reviews;

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
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.movies.MovieService;
import ru.ifmo.is.mfl.reviews.dto.*;
import ru.ifmo.is.mfl.users.UserService;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Reviews")
public class ReviewController {

  private final ReviewService service;
  private final UserService userService;
  private final MovieService movieService;

  @GetMapping("/reviews")
  @Operation(summary = "Получить все рецензии")
  public ResponseEntity<Page<ReviewDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var reviews = service.getAll(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reviews.getTotalElements()))
      .body(reviews);
  }

  @PostMapping("/reviews/search")
  @Operation(summary = "Поиск и фильтрация рецензий")
  public ResponseEntity<Page<ReviewDto>> search(
    @PageableDefault(size = 20) Pageable pageable,
    @RequestBody(required = false) SearchDto request
  ) {
    var reviews = service.findBySearchCriteria(request, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reviews.getTotalElements()))
      .body(reviews);
  }

  @GetMapping("/users/{userId}/reviews")
  @Operation(summary = "Получить все рецензии пользователя")
  public ResponseEntity<Page<ReviewWithoutUserDto>> userReviews(@PathVariable int userId, @PageableDefault(size = 20) Pageable pageable) {
    var user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    var reviews = service.getUserReviews(user, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reviews.getTotalElements()))
      .body(reviews);
  }

  @GetMapping("/movies/{movieId}/reviews")
  @Operation(summary = "Получить все рецензии фильма")
  public ResponseEntity<Page<ReviewWithoutMovieDto>> movieReviews(@PathVariable int movieId, @PageableDefault(size = 20) Pageable pageable) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var reviews = service.getMovieReviews(movie, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reviews.getTotalElements()))
      .body(reviews);
  }

  @GetMapping("/reviews/{id}")
  @Operation(summary = "Получить рецензию по ID")
  public ResponseEntity<ReviewDto> show(@PathVariable int id) {
    var review = service.getById(id);
    return ResponseEntity.ok(review);
  }

  @PostMapping("/movies/{movieId}/reviews")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Создать рецензию для фильма", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<ReviewDto> create(@PathVariable int movieId, @Valid @RequestBody ReviewCreateDto dto) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var review = service.create(dto, movie);
    return ResponseEntity.status(HttpStatus.CREATED).body(review);
  }

  @PatchMapping("/reviews/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Обновить рецензию по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<ReviewDto> update(@PathVariable int id, @Valid @RequestBody ReviewUpdateDto dto) {
    var review = service.update(dto, id);
    return ResponseEntity.ok(review);
  }

  @DeleteMapping("/reviews/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить рецензию по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
