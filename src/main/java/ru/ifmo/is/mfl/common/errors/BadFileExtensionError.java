package ru.ifmo.is.mfl.common.errors;

public class BadFileExtensionError extends RuntimeException {
  public BadFileExtensionError() {
    super();
  }

  public BadFileExtensionError(String message) {
    super(message);
  }
}
