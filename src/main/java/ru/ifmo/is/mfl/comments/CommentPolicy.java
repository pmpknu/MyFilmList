package ru.ifmo.is.mfl.comments;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class CommentPolicy extends CrudPolicy<Comment> {

  @Override
  public User getCreator(Comment object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "comments";
  }
}
