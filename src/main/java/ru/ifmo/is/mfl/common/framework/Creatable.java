package ru.ifmo.is.mfl.common.framework;

import ru.ifmo.is.mfl.users.User;

public interface Creatable {
  User getUser();
  void setUser(User user);
}
