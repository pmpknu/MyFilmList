package ru.ifmo.is.mfl.movieviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieViewDto extends CrudDto {
  private int id;
  private int userId;
  private int movieId;
  private Instant watchDate;
}
