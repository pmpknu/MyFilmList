package ru.ifmo.is.mfl.ratings.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingUpdateDto {
  @NotNull
  @Min(1)
  @Max(10)
  private Integer value;
}
