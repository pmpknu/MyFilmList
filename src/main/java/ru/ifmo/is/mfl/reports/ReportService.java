package ru.ifmo.is.mfl.reports;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.comments.Comment;
import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.common.errors.ResourceAlreadyExists;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.errors.StaleRequestException;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;

import ru.ifmo.is.mfl.reports.dto.*;
import ru.ifmo.is.mfl.reviews.Review;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ReportService extends ApplicationService {

  private final ReportMapper mapper;
  private final ReportPolicy policy;
  private final ReportRepository repository;

  private final SearchMapper<Report> searchMapper;

  public Page<ReportDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    return repository.findAll(pageable).map(mapper::map);
  }

  public Page<ReportDto> getPending(Pageable pageable) {
    policy.showAll(currentUser());

    return repository.findAllByResolved(false, pageable).map(mapper::map);
  }

  public Page<ReportDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    return repository.findAll(searchMapper.map(searchData), pageable).map(mapper::map);
  }

  public ReportDto getById(int id) {
    var report = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), report);

    return mapper.map(report);
  }

  @Transactional
  public ReportDto create(ReportCreateDto dto, Comment comment) {
    policy.create(currentUser());

    var report = Report.builder()
      .user(currentUser())
      .comment(comment)
      .issue(dto.getIssue())
      .text(dto.getText())
      .date(Instant.now())
      .resolved(false)
      .build();

    repository.save(report);
    return mapper.map(report);
  }

  @Transactional
  public ReportDto create(ReportCreateDto dto, Review review) {
    policy.create(currentUser());

    var report = Report.builder()
      .user(currentUser())
      .review(review)
      .issue(dto.getIssue())
      .text(dto.getText())
      .date(Instant.now())
      .resolved(false)
      .build();

    repository.save(report);
    return mapper.map(report);
  }

  @Transactional
  public ReportDto update(ReportUpdateDto dto, int id) {
    var report = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), report);

    if (report.isResolved()) {
      var daysFromResolve = Duration.between(report.getResolvedAt(), Instant.now()).toDays();
      if (!currentUser().isAdmin() && daysFromResolve > 7) {
        throw new StaleRequestException("Only an administrator can edit reports older than 7 days.");
      }
    }

    // Somebody changing resolved flag
    if (dto.getResolved() != null) {
      if (dto.getResolved().get()) {
        // changing to true
        if (report.isResolved()) {
          throw new ResourceAlreadyExists("This report is already resolved.");
        }
        // resolved false -> true
        report.setResolvedBy(currentUser());
        report.setResolvedAt(Instant.now());
      } else {
        // changing to false
        if (!report.isResolved()) {
          throw new ResourceAlreadyExists("This report is not resolved yet.");
        }
        // resolved true -> false
        report.setResolvedBy(null);
        report.setResolvedAt(null);
      }
    }

    mapper.update(dto, report);

    repository.save(report);
    return mapper.map(report);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var report = repository.findById(id);
    return report.map(r -> {
      policy.delete(currentUser(), r);

      repository.delete(r);
      return true;
    }).orElse(false);
  }
}
