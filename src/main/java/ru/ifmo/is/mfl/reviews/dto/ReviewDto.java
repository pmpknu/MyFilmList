package ru.ifmo.is.mfl.reviews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewDto extends CrudDto {
  private int id;
  private int userId;
  private int movieId;
  private boolean visible;
  private String text;
  private Date date;
}
