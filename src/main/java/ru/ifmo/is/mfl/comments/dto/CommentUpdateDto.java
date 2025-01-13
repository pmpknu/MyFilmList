package ru.ifmo.is.mfl.comments.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class CommentUpdateDto {
  @NotNull
  @NotBlank
  private JsonNullable<String> text;

  @NotNull
  private JsonNullable<Boolean> visible;
}
