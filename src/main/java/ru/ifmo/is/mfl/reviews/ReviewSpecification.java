package ru.ifmo.is.mfl.reviews;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.users.User;

@Component
@RequiredArgsConstructor
public class ReviewSpecification {

  public Specification<Review> withVisible() {
    return (root, query, cb) -> cb.equal(root.get("visible"), true);
  }

  public Specification<Review> withUser(int userId) {
    return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
  }

  public Specification<Review> withMovie(int movieId) {
    return (root, query, cb) -> cb.equal(root.get("movie").get("id"), movieId);
  }

  public Specification<Review> visible(User currentUser) {
    return currentUser == null
      ? withVisible()
      : withVisible().or(withUser(currentUser.getId()));
  }
}
