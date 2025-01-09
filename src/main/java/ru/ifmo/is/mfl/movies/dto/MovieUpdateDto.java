package ru.ifmo.is.mfl.movies.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.openapitools.jackson.nullable.JsonNullable;

import java.time.LocalDate;

@Data
public class MovieUpdateDto {
  @NotNull
  @NotBlank
  private JsonNullable<String> title;

  private JsonNullable<String> description;

  private JsonNullable<LocalDate> releaseDate;

  private JsonNullable<Integer> duration;

  @Size(max = 127)
  private JsonNullable<String> categories;

  @Size(max = 127)
  private JsonNullable<String> tags;

  @Size(max = 63)
  private JsonNullable<String> productionCountry;

  @Size(max = 127)
  private JsonNullable<String> genres;

  private JsonNullable<String> actors;

  @Size(max = 127)
  private JsonNullable<String> director;

  private JsonNullable<Integer> seasons;

  private JsonNullable<Integer> series;
}
