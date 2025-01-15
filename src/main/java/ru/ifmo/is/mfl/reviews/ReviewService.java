package ru.ifmo.is.mfl.reviews;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.PolicyViolationError;
import ru.ifmo.is.mfl.common.errors.ResourceAlreadyExists;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;

import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.reviews.dto.*;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService extends ApplicationService {

  private final ReviewMapper mapper;
  private final ReviewPolicy policy;
  private final ReviewRepository repository;
  private final ReviewSpecification specification;
  private final SearchMapper<Review> searchMapper;

  public Optional<Review> findById(int id) {
    var review = repository.findById(id);
    if (review.isEmpty()) {
      return Optional.empty();
    }
    if (review.get().isVisible() || policy.canUpdate(currentUser(), review.get())) {
      return review;
    }
    return Optional.empty();
  }

  public Page<ReviewDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all reviews
    var reviews = canManageContent()
      ? repository.findAll(pageable)
      : repository.findAll(specification.visible(currentUser()), pageable);

    return reviews.map(mapper::map);
  }

  public Page<ReviewWithoutUserDto> getUserReviews(User user, Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all user's reviews
    var spec = canManageContent()
      ? specification.withUser(user.getId())
      : specification.visible(currentUser()).and(specification.withUser(user.getId()));

    var reviews = repository.findAll(spec, pageable);
    return reviews.map(mapper::mapNoUsers);
  }

  public Page<ReviewWithoutMovieDto> getMovieReviews(Movie movie, Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all movie's reviews
    var spec = canManageContent()
      ? specification.withMovie(movie.getId())
      : specification.visible(currentUser()).and(specification.withMovie(movie.getId()));

    var reviews = repository.findAll(spec, pageable);
    return reviews.map(mapper::mapNoMovies);
  }

  public Page<ReviewDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    // Admins and moderators can search in all reviews
    var spec = canManageContent()
      ? searchMapper.map(searchData)
      : specification.visible(currentUser()).and(searchMapper.map(searchData));

    var reviews = repository.findAll(spec, pageable);
    return reviews.map(mapper::map);
  }

  public ReviewDto getById(int id) {
    var review = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), review);

    // Check is visible to user
    if (review.isVisible() || policy.canUpdate(currentUser(), review)) {
      if (review.isVisible()) {
        // Update viewers count only on public reviews
        review.incrementViewedCounter();
      }
      return mapper.map(repository.save(review));
    }

    throw new ResourceNotFoundException("Not Found: " + id);
  }

  @Transactional
  public ReviewDto create(ReviewCreateDto dto, Movie movie) {
    policy.create(currentUser());

    if (repository.findByMovieAndUser(movie, currentUser()).isPresent()) {
      throw new ResourceAlreadyExists("You already have review for movie #" + movie.getId());
    }

    var review = mapper.map(dto);
    review.setUser(currentUser());
    review.setMovie(movie);
    review.setVisible(true);
    review.setDate(Instant.now());
    review.setViewedCounter(0);

    movie.incrementReviewedCounter();

    repository.save(review);
    return mapper.map(review);
  }

  @Transactional
  public ReviewDto update(ReviewUpdateDto dto, int id) {
    var review = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), review);

    if (dto.getVisible() != null && !canManageContent()) {
      throw new PolicyViolationError("You are not allowed to change visibility of review #" + review.getId());
    }

    if (dto.getVisible() != null) {
      if (dto.getVisible().get()) {
        if (!review.isVisible()) {
          // made it public
          review.getMovie().incrementReviewedCounter();
        }
      } else {
        if (review.isVisible()) {
          // made it private
          review.getMovie().decrementReviewedCounter();
        }
      }
    }

    mapper.update(dto, review);
    repository.save(review);

    return mapper.map(review);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var review = repository.findById(id);
    return review.map(r -> {
      policy.delete(currentUser(), r);
      if (r.isVisible()) {
        r.getMovie().decrementReviewedCounter();
      }
      repository.delete(r);
      return true;
    }).orElse(false);
  }

  private boolean canManageContent() {
    return currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator());
  }
}
