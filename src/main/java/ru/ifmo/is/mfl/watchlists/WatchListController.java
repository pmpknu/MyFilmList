package ru.ifmo.is.mfl.watchlists;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ru.ifmo.is.mfl.common.errors.FileIsEmptyError;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.movies.MovieService;
import ru.ifmo.is.mfl.movies.dto.MovieWithAdditionalInfoDto;
import ru.ifmo.is.mfl.users.UserService;
import ru.ifmo.is.mfl.watchlists.dto.*;

import javax.naming.LimitExceededException;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Watch Lists")
public class WatchListController {

  private final WatchListService service;
  private final UserService userService;
  private final MovieService movieService;

  @GetMapping("/watchlists/{id}/movies")
  @Operation(summary = "Получить все фильмы из коллекции")
  public ResponseEntity<Page<MovieWithAdditionalInfoDto>> movies(@PathVariable int id, @PageableDefault(size = 20) Pageable pageable) {
    var watchList = service.findById(id);
    if (watchList == null) {
      throw new ResourceNotFoundException("Not Found: " + id);
    }

    var movies = service.getMovies(watchList, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(movies.getTotalElements()))
      .body(movies);
  }

  @PostMapping("/watchlists/{id}/movies/{movieId}")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Добавить фильм в коллекцию", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<WatchListDto> addMovie(@PathVariable int id, @PathVariable int movieId) throws Exception {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var watchList = service.addMovie(id, movie);
    return ResponseEntity.status(HttpStatus.CREATED).body(watchList);
  }

  @DeleteMapping("/watchlists/{id}/movies/{movieId}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить фильм из коллекции", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> removeMovie(@PathVariable int id, @PathVariable int movieId) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    if (service.removeMovie(id, movie)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/watchlists")
  @Operation(summary = "Получить все коллекции фильмов")
  public ResponseEntity<Page<WatchListDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var watchLists = service.getAll(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(watchLists.getTotalElements()))
      .body(watchLists);
  }

  @PostMapping("/watchlists/search")
  @Operation(summary = "Поиск и фильтрация коллекций фильмов")
  public ResponseEntity<Page<WatchListDto>> search(
    @PageableDefault(size = 20) Pageable pageable,
    @RequestBody(required = false) SearchDto request
  ) {
    var watchLists = service.findBySearchCriteria(request, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(watchLists.getTotalElements()))
      .body(watchLists);
  }

  @GetMapping("/users/{userId}/watchlists")
  @Operation(summary = "Получить все коллекции фильмов пользователя")
  public ResponseEntity<Page<WatchListDto>> userWatchLists(@PathVariable int userId, @PageableDefault(size = 20) Pageable pageable) {
    var user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    var watchLists = service.getUserWatchLists(user, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(watchLists.getTotalElements()))
      .body(watchLists);
  }

  @GetMapping("/movies/{movieId}/watchlists")
  @Operation(summary = "Получить все коллекции фильмов в которых есть заданный фильм")
  public ResponseEntity<Page<WatchListDto>> movieWatchLists(@PathVariable int movieId, @PageableDefault(size = 20) Pageable pageable) {
    var movie = movieService.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + movieId));
    var watchLists = service.getMovieWatchLists(movie, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(watchLists.getTotalElements()))
      .body(watchLists);
  }

  @GetMapping("/watchlists/{id}")
  @Operation(summary = "Получить коллекцию фильмов по ID")
  public ResponseEntity<WatchListDto> show(@PathVariable int id) {
    var watchList = service.getById(id);
    return ResponseEntity.ok(watchList);
  }

  @PostMapping(path = "/watchlists/{id}/photo", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Загрузить картинку для коллекции фильмов", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<WatchListDto> upload(@PathVariable int id, @RequestParam("file") MultipartFile file) throws Exception {
    if (file.isEmpty()) {
      throw new FileIsEmptyError("File not found");
    }

    if (file.getSize() / (1024 * 1024) > 10) {
      throw new LimitExceededException("Image size must be less than 10MB");
    }

    var byteArray = new ByteArrayOutputStream();
    IOUtils.copy(file.getInputStream(), byteArray);
    var bytes = byteArray.toByteArray();

    var watchList = service.upload(id, file.getOriginalFilename(), bytes, file.getContentType());
    return ResponseEntity.ok(watchList);
  }

  @PostMapping("/watchlists")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Создать коллекцию фильмов", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<WatchListDto> create(@Valid @RequestBody WatchListCreateDto dto) {
    var watchList = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(watchList);
  }

  @PatchMapping("/watchlists/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Обновить коллекцию фильмов по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<WatchListDto> update(@PathVariable int id, @Valid @RequestBody WatchListUpdateDto dto) {
    var watchList = service.update(dto, id);
    return ResponseEntity.ok(watchList);
  }

  @DeleteMapping("/watchlists/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить коллекцию фильмов по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
