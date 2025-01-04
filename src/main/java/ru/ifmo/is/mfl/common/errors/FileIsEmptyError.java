package ru.ifmo.is.mfl.common.errors;

public class FileIsEmptyError extends RuntimeException {
  public FileIsEmptyError() {
    super();
  }

  public FileIsEmptyError(String message) {
    super(message);
  }
}
