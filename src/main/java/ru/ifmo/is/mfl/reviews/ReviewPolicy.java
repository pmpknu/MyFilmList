package ru.ifmo.is.mfl.reviews;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class ReviewPolicy extends CrudPolicy<Review> {

  @Override
  public User getCreator(Review object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "reviews";
  }
}
