package ru.ifmo.is.mfl.ratings.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class RatingWithoutMovieDto extends CrudDto {
  private int id;
  private UserDto user;
  private int value;
}
