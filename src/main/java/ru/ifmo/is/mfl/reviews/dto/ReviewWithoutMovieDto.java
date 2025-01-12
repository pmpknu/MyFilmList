package ru.ifmo.is.mfl.reviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewWithoutMovieDto extends CrudDto {
  private int id;
  private UserDto user;
  private boolean visible;
  private String text;
  private int rating;
  private Instant date;
  private int viewedCounter;
}
