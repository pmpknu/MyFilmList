package ru.ifmo.is.mfl.comments.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class CommentCreateDto {
  @NotNull
  @NotBlank
  private String text;
}
