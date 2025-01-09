package ru.ifmo.is.mfl.comments.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.User;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class CommentDto extends CrudDto {
  private int id;
  private User user;
  private Integer reviewId;
  private Integer watchListId;
  private Integer movieId;
  private boolean visible;
  private String text;
  private LocalDateTime date;
}
