package ru.ifmo.is.mfl.reviews.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class ReviewUpdateDto {
  @NotNull
  private JsonNullable<String> text;

  private JsonNullable<Boolean> visible;
}
