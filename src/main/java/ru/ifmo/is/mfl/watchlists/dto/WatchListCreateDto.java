package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class WatchListCreateDto {
  @NotNull
  @NotBlank
  private String name;

  private Boolean visibility;
}
