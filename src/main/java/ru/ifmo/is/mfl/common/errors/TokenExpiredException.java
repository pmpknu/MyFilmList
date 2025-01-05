package ru.ifmo.is.mfl.common.errors;

public class TokenExpiredException extends RuntimeException {
  public TokenExpiredException() {
    super();
  }

  public TokenExpiredException(String message) {
    super(message);
  }
}
