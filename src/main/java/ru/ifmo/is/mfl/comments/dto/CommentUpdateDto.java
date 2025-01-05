package ru.ifmo.is.mfl.comments.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class CommentUpdateDto {
  @NotNull
  private JsonNullable<String> text;

  private JsonNullable<Boolean> visible;
}
