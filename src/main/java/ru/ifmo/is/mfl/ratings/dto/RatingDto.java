package ru.ifmo.is.mfl.ratings.dto;

import lombok.*;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class RatingDto extends CrudDto {
  private int id;
  private int userId;
  private int movieId;
  private int value;
}
