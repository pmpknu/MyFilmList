package ru.ifmo.is.mfl.reviews.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ReviewCreateDto {
  @NotNull
  @NotBlank
  private String text;

  @NotNull
  private Boolean visible;

  @NotNull
  @Min(1)
  @Max(10)
  private Integer rating;
}
