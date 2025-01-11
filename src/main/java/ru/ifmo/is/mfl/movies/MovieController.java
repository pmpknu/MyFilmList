package ru.ifmo.is.mfl.movies;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ru.ifmo.is.mfl.common.errors.FileIsEmptyError;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.movies.dto.*;

import javax.naming.LimitExceededException;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping(value = "/api/movies", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Movies")
public class MovieController {

  private final MovieService service;

  @GetMapping
  @Operation(summary = "Получить все фильмы")
  public ResponseEntity<Page<MovieWithAdditionalInfoDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var movies = service.getAll(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(movies.getTotalElements()))
      .body(movies);
  }

  @PostMapping("/search")
  @Operation(summary = "Поиск и фильтрация фильмов")
  public ResponseEntity<Page<MovieWithAdditionalInfoDto>> search(
    @PageableDefault(size = 20) Pageable pageable,
    @RequestBody(required = false) SearchDto request
  ) {
    var movies = service.findBySearchCriteria(request, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(movies.getTotalElements()))
      .body(movies);
  }

  @PostMapping(path = "/{id}/poster", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Загрузить постер фильма", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<MovieDto> upload(@PathVariable int id, @RequestParam("file") MultipartFile file) throws Exception {
    if (file.isEmpty()) {
      throw new FileIsEmptyError("File not found");
    }

    if (file.getSize() / (1024 * 1024) > 10) {
      throw new LimitExceededException("Image size must be less than 10MB");
    }

    var byteArray = new ByteArrayOutputStream();
    IOUtils.copy(file.getInputStream(), byteArray);
    var bytes = byteArray.toByteArray();

    var movie = service.upload(id, file.getOriginalFilename(), bytes, file.getContentType());
    return ResponseEntity.ok(movie);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Получить фильм по ID")
  public ResponseEntity<MovieWithAdditionalInfoDto> show(@PathVariable int id) {
    var movie = service.getById(id);
    return ResponseEntity.ok(movie);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Создать фильм", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<MovieDto> create(@Valid @RequestBody MovieCreateDto dto) {
    var movie = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(movie);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Обновить фильм по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<MovieDto> update(@PathVariable int id, @Valid @RequestBody MovieUpdateDto dto) {
    var movie = service.update(dto, id);
    return ResponseEntity.ok(movie);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Удалить фильм по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
