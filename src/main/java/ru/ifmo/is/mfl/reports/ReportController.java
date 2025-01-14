package ru.ifmo.is.mfl.reports;

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

import ru.ifmo.is.mfl.comments.CommentService;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.reports.dto.ReportCreateDto;
import ru.ifmo.is.mfl.reports.dto.ReportDto;
import ru.ifmo.is.mfl.reports.dto.ReportUpdateDto;
import ru.ifmo.is.mfl.reviews.ReviewService;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Reports")
public class ReportController {

  private final ReportService service;
  private final CommentService commentService;
  private final ReviewService reviewService;

  @GetMapping("/reports")
  @Operation(summary = "Получить все жалобы")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public ResponseEntity<Page<ReportDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var reports = service.getAll(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reports.getTotalElements()))
      .body(reports);
  }

  @GetMapping("/reports/pending")
  @Operation(summary = "Получить все нерассмотренные жалобы")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public ResponseEntity<Page<ReportDto>> pending(@PageableDefault(size = 20) Pageable pageable) {
    var reports = service.getPending(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reports.getTotalElements()))
      .body(reports);
  }

  @PostMapping("/reports/search")
  @Operation(summary = "Поиск и фильтрация жалоб")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public ResponseEntity<Page<ReportDto>> search(
    @PageableDefault(size = 20) Pageable pageable,
    @RequestBody(required = false) SearchDto request
  ) {
    var reports = service.findBySearchCriteria(request, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(reports.getTotalElements()))
      .body(reports);
  }

  @GetMapping("/reports/{id}")
  @Operation(summary = "Получить жалобу по ID")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public ResponseEntity<ReportDto> show(@PathVariable int id) {
    var report = service.getById(id);
    return ResponseEntity.ok(report);
  }

  @PostMapping("/reviews/{reviewId}/reports")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Пожаловаться на рецензию", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<ReportDto> reportReview(@PathVariable int reviewId, @Valid @RequestBody ReportCreateDto dto) {
    var review = reviewService.findById(reviewId).orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
    var report = service.create(dto, review);
    return ResponseEntity.status(HttpStatus.CREATED).body(report);
  }

  @PostMapping("/comments/{commentId}/reports")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Пожаловаться на комментарий", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<ReportDto> reportComment(@PathVariable int commentId, @Valid @RequestBody ReportCreateDto dto) {
    var comment = commentService.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));
    var report = service.create(dto, comment);
    return ResponseEntity.status(HttpStatus.CREATED).body(report);
  }

  @PatchMapping("/reports/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  @Operation(summary = "Обновить жалобу по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<ReportDto> update(@PathVariable int id, @Valid @RequestBody ReportUpdateDto dto) {
    var report = service.update(dto, id);
    return ResponseEntity.ok(report);
  }

  @DeleteMapping("/reports/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Удалить жалобу по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
