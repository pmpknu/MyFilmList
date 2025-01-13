package ru.ifmo.is.mfl.comments;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.users.User;

@Component
@RequiredArgsConstructor
public class CommentSpecification {

  public Specification<Comment> withVisible() {
    return (root, query, cb) -> cb.equal(root.get("visible"), true);
  }

  public Specification<Comment> withUser(int userId) {
    return with("user", userId);
  }

  public Specification<Comment> withReview(int reviewId) {
    return with("review", reviewId);
  }

  public Specification<Comment> withWatchList(int watchListId) {
    return with("watchList", watchListId);
  }

  public Specification<Comment> withMovie(int movieId) {
    return with("movie", movieId);
  }

  public Specification<Comment> visible(User currentUser) {
    return currentUser == null
      ? withVisible()
      : withVisible().or(withUser(currentUser.getId()));
  }

  private Specification<Comment> with(String subject, int subjectId) {
    return (root, query, cb) -> cb.equal(root.get(subject).get("id"), subjectId);
  }
}
