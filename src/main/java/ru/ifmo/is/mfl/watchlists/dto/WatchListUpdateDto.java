package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class WatchListUpdateDto {
  @NotNull
  private JsonNullable<String> name;

  private JsonNullable<Boolean> visibility;
}
