package ru.ifmo.is.mfl.movies.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieDto extends CrudDto {
  private int id;
  private String title;
  private String description;
  private String poster;
  private LocalDate releaseDate;
  private Integer duration;
  private String categories;
  private String tags;
  private String productionCountry;
  private String genres;
  private String actors;
  private String director;
  private Integer seasons;
  private Integer series;
}
