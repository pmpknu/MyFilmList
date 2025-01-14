package ru.ifmo.is.mfl.comments;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.common.errors.PolicyViolationError;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;

import ru.ifmo.is.mfl.comments.dto.*;
import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.reviews.Review;
import ru.ifmo.is.mfl.watchlists.WatchList;

import java.time.Instant;
import java.util.Optional;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class CommentService extends ApplicationService {

  private final CommentMapper mapper;
  private final CommentPolicy policy;
  private final CommentRepository repository;
  private final CommentSpecification specification;

  public Optional<Comment> findById(int id) {
    var comment = repository.findById(id);
    if (comment.isEmpty()) {
      return Optional.empty();
    }
    if (comment.get().isVisible() || policy.canUpdate(currentUser(), comment.get())) {
      return comment;
    }
    return Optional.empty();
  }

  public Page<CommentDto> getAll(Review review, Pageable pageable) {
    return getCommentsBySpecification(review.getId(), specification::withReview, pageable);
  }

  public Page<CommentDto> getAll(WatchList watchList, Pageable pageable) {
    return getCommentsBySpecification(watchList.getId(), specification::withWatchList, pageable);
  }

  public Page<CommentDto> getAll(Movie movie, Pageable pageable) {
    return getCommentsBySpecification(movie.getId(), specification::withMovie, pageable);
  }

  @Transactional
  public CommentDto create(CommentCreateDto dto, Review review) {
    return createSubject(dto, review);
  }

  @Transactional
  public CommentDto create(CommentCreateDto dto, WatchList watchList) {
    return createSubject(dto, watchList);
  }

  @Transactional
  public CommentDto create(CommentCreateDto dto, Movie movie) {
    return createSubject(dto, movie);
  }

  @Transactional
  public CommentDto update(CommentUpdateDto dto, int id) {
    var comment = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), comment);

    if (dto.getVisible() != null && !canManageContent()) {
      throw new PolicyViolationError("You are not allowed to change visibility of comment #" + comment.getId());
    }

    mapper.update(dto, comment);
    if (currentUser().equals(comment.getUser())) {
      comment.setUpdatedAt(Instant.now());
    }

    if (dto.getVisible() != null && comment.getMovie() != null) {
      if (dto.getVisible().get()) {
        // made it public
        comment.getMovie().incrementReviewedCounter();
      } else {
        // made it private
        comment.getMovie().decrementReviewedCounter();
      }
    }

    repository.save(comment);
    return mapper.map(comment);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var comment = repository.findById(id);
    return comment.map(c -> {
      policy.delete(currentUser(), c);
      if (c.isVisible() && c.getMovie() != null) {
        c.getMovie().decrementReviewedCounter();
      }
      repository.delete(c);
      return true;
    }).orElse(false);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public CommentDto createSubject(CommentCreateDto dto, CrudEntity entity) {
    policy.create(currentUser());

    var comment = Comment.builder()
      .text(dto.getText())
      .user(currentUser())
      .visible(true)
      .createdAt(Instant.now())
      .build();

    if (entity instanceof Review) {
      comment.setReview((Review) entity);
    }
    if (entity instanceof WatchList) {
      comment.setWatchList((WatchList) entity);
    }
    if (entity instanceof Movie) {
      ((Movie) entity).incrementCommentsCounter();
      comment.setMovie((Movie) entity);
    }

    repository.save(comment);
    return mapper.map(comment);
  }

  private Page<CommentDto> getCommentsBySpecification(
    int subjectId,
    Function<Integer, Specification<Comment>> applier,
    Pageable pageable
  ) {
    policy.showAll(currentUser());

    // Admins and moderators can see all subject's comments
    var spec = canManageContent()
      ? applier.apply(subjectId)
      : specification.visible(currentUser()).and(applier.apply(subjectId));

    var comments = repository.findAll(spec, pageable);
    return comments.map(mapper::map);
  }

  private boolean canManageContent() {
    return currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator());
  }
}
