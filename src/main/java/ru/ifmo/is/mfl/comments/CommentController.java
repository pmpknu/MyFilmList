package ru.ifmo.is.mfl.comments;

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
import ru.ifmo.is.mfl.comments.dto.*;
import ru.ifmo.is.mfl.movies.MovieService;
import ru.ifmo.is.mfl.reviews.ReviewService;
import ru.ifmo.is.mfl.watchlists.WatchListService;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Comments")
public class CommentController {

  private final CommentService service;

  private final ReviewService reviewService;
  private final WatchListService watchListService;
  private final MovieService movieService;

  @GetMapping("/reviews/{reviewId}/comments")
  @Operation(summary = "Получить все комментарии рецензии")
  public ResponseEntity<Page<CommentDto>> reviewComments(@PathVariable int reviewId, @PageableDefault(size = 20) Pageable pageable) {
    var review = reviewService.findById(reviewId).orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
    var comments = service.getAll(review, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(comments.getTotalElements()))
      .body(comments);
  }

  @GetMapping("/watchlists/{watchListId}/comments")
  @Operation(summary = "Получить все комментарии коллекции")
  public ResponseEntity<Page<CommentDto>> watchListComments(@PathVariable int watchListId, @PageableDefault(size = 20) Pageable pageable) {
    var watchList = watchListService.findById(watchListId).orElseThrow(() -> new ResourceNotFoundException("Watch list not found: " + watchListId));
    var comments = service.getAll(watchList, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(comments.getTotalElements()))
      .body(comments);
  }

  @GetMapping("/movies/{movieId}/comments")
  @Operation(summary = "Получить все комментарии фильма")
  public ResponseEntity<Page<CommentDto>> movieComments(@PathVariable int movieId, @PageableDefault(size = 20) Pageable pageable) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var comments = service.getAll(movie, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(comments.getTotalElements()))
      .body(comments);
  }

  @PostMapping("/reviews/{reviewId}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Добавить комментарий к рецензии", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<CommentDto> addToReview(@PathVariable int reviewId, @Valid @RequestBody CommentCreateDto dto) {
    var review = reviewService.findById(reviewId).orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
    var comment = service.create(dto, review);
    return ResponseEntity.status(HttpStatus.CREATED).body(comment);
  }

  @PostMapping("/watchlists/{watchListId}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Добавить комментарий к коллекции", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<CommentDto> addToWatchList(@PathVariable int watchListId, @Valid @RequestBody CommentCreateDto dto) {
    var watchList = watchListService.findById(watchListId).orElseThrow(() -> new ResourceNotFoundException("Watch list not found: " + watchListId));
    var comment = service.create(dto, watchList);
    return ResponseEntity.status(HttpStatus.CREATED).body(comment);
  }

  @PostMapping("/movies/{movieId}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Добавить комментарий к фильму", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<CommentDto> addToMovie(@PathVariable int movieId, @Valid @RequestBody CommentCreateDto dto) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var comment = service.create(dto, movie);
    return ResponseEntity.status(HttpStatus.CREATED).body(comment);
  }

  @PatchMapping("/comments/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Обновить комментарий по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<CommentDto> update(@PathVariable int id, @Valid @RequestBody CommentUpdateDto dto) {
    var comment = service.update(dto, id);
    return ResponseEntity.ok(comment);
  }

  @DeleteMapping("/comments/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить комментарий по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
