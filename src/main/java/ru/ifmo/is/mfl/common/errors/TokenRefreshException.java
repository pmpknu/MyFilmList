package ru.ifmo.is.mfl.common.errors;

public class TokenRefreshException extends RuntimeException {
  public TokenRefreshException() {
    super();
  }

  public TokenRefreshException(String message) {
    super(message);
  }
}
