package ru.ifmo.is.mfl.common.application;

import org.springframework.data.jpa.domain.Specification;

import ru.ifmo.is.mfl.common.framework.CrudSpecification;
import ru.ifmo.is.mfl.users.User;

public abstract class VisibleSpecification<T> extends CrudSpecification<T> {

  public Specification<T> withUser(int userId) {
    return with("user", userId);
  }

  public Specification<T> withVisible() {
    return (root, query, cb) -> cb.equal(root.get("visible"), true);
  }

  public Specification<T> visible(User currentUser) {
    return currentUser == null
      ? withVisible()
      : withVisible().or(withUser(currentUser.getId()));
  }
}
