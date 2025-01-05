package ru.ifmo.is.mfl.comments.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class CommentDto extends CrudDto {
  private int id;
  private int userId;
  private int reviewId;
  private boolean visible;
  private String text;
  private LocalDateTime date;
}
