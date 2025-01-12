package ru.ifmo.is.mfl.reviews.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class ReviewUpdateDto {
  @NotNull
  @NotBlank
  private JsonNullable<String> text;

  @NotNull
  private JsonNullable<Boolean> visible;

  @NotNull
  @Min(1)
  @Max(10)
  private JsonNullable<Integer> rating;
}
