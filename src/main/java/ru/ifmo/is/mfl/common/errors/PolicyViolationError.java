package ru.ifmo.is.mfl.common.errors;

public class PolicyViolationError extends RuntimeException {
  public PolicyViolationError() {
    super();
  }

  public PolicyViolationError(String message) {
    super(message);
  }
}
