package ru.ifmo.is.mfl.reviews;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.application.VisibleSpecification;

@Component
@RequiredArgsConstructor
public class ReviewSpecification extends VisibleSpecification<Review> {

  public Specification<Review> withMovie(int movieId) {
    return with("movie", movieId);
  }
}
