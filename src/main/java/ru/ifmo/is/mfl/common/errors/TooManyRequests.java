package ru.ifmo.is.mfl.common.errors;

public class TooManyRequests extends RuntimeException {
  public TooManyRequests() {
    super();
  }

  public TooManyRequests(String message) {
    super(message);
  }
}
