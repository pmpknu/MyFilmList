package ru.ifmo.is.mfl.comments;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.application.VisibleSpecification;

@Component
@RequiredArgsConstructor
public class CommentSpecification extends VisibleSpecification<Comment> {

  public Specification<Comment> withReview(int reviewId) {
    return with("review", reviewId);
  }

  public Specification<Comment> withWatchList(int watchListId) {
    return with("watchList", watchListId);
  }

  public Specification<Comment> withMovie(int movieId) {
    return with("movie", movieId);
  }
}
