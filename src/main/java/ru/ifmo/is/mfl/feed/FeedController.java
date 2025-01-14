package ru.ifmo.is.mfl.feed;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ru.ifmo.is.mfl.movies.dto.MovieDto;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Feed")
public class FeedController {

  private final FeedService service;

  @GetMapping("/movies/feed")
  @Operation(summary = "Получить рекомендованные фильмы")
  public ResponseEntity<Page<MovieDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var movies = service.getRecommendedMovies(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(movies.getTotalElements()))
      .body(movies);
  }
}
