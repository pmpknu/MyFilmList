package ru.ifmo.is.mfl.common.errors;

public class UserWithThisUsernameAlreadyExists extends RuntimeException {
  public UserWithThisUsernameAlreadyExists() {
    super();
  }

  public UserWithThisUsernameAlreadyExists(String message) {
    super(message);
  }
}
