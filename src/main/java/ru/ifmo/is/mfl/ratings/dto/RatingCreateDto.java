package ru.ifmo.is.mfl.ratings.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RatingCreateDto {
  @NotNull
  @Min(1)
  @Max(10)
  private int value;
}
