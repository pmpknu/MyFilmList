package ru.ifmo.is.mfl.reports;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.comments.Comment;
import ru.ifmo.is.mfl.reviews.Review;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

public interface ReportRepository extends CrudRepository<Report> {
  Page<Report> findAllByResolved(boolean resolved, Pageable pageable);
  Optional<Report> findByUserAndComment(User user, Comment comment);
  Optional<Report> findByUserAndReview(User user, Review review);
}
