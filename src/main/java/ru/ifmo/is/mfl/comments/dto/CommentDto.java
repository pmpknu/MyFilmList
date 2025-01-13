package ru.ifmo.is.mfl.comments.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class CommentDto extends CrudDto {
  private int id;
  private UserDto user;
  private Integer reviewId;
  private Integer watchListId;
  private Integer movieId;
  private boolean visible;
  private String text;
  private Instant createdAt;
  private Instant updatedAt;
}
