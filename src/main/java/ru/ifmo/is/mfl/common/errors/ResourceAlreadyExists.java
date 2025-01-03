package ru.ifmo.is.mfl.common.errors;

public class ResourceAlreadyExists extends RuntimeException {
  public ResourceAlreadyExists() {
    super();
  }

  public ResourceAlreadyExists(String message) {
    super(message);
  }
}
