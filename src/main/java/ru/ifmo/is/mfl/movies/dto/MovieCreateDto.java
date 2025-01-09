package ru.ifmo.is.mfl.movies.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Data
public class MovieCreateDto {
  @NotNull
  @NotBlank
  private String title;

  private String description;

  @Size(max = 255)
  private String poster;

  private LocalDate releaseDate;

  private Integer duration;

  @Size(max = 127)
  private String categories;

  @Size(max = 127)
  private String tags;

  @Size(max = 63)
  private String productionCountry;

  @Size(max = 127)
  private String genres;

  private String actors;

  @Size(max = 127)
  private String director;

  private Integer seasons;

  private Integer series;
}
