package ru.ifmo.is.mfl.ratings;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class RatingPolicy extends CrudPolicy<Rating> {

  @Override
  public boolean canDelete(User user, Rating object) {
    return true;
  }

  @Override
  public boolean canUpdate(User user, Rating object) {
    return true;
  }

  @Override
  public User getCreator(Rating object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "ratings";
  }
}
