package ru.ifmo.is.mfl.movies.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

import java.time.LocalDate;

@Data
public class MovieUpdateDto {
  @NotNull
  private JsonNullable<String> title;

  private JsonNullable<String> description;

  private JsonNullable<String> poster;

  private JsonNullable<LocalDate> releaseDate;

  private JsonNullable<Integer> duration;

  private JsonNullable<String> categories;

  private JsonNullable<String> tags;

  private JsonNullable<String> productionCountry;

  private JsonNullable<String> genres;

  private JsonNullable<String> actors;

  private JsonNullable<String> director;

  private JsonNullable<Integer> seasons;

  private JsonNullable<Integer> series;
}
