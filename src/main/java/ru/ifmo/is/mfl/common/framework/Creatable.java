package ru.ifmo.is.mfl.common.framework;

import ru.ifmo.is.mfl.users.User;

public abstract class Creatable extends CrudEntity {
  abstract User getUser();
  abstract void setUser(User user);
}
