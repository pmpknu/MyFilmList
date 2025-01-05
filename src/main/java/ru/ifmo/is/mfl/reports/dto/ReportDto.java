package ru.ifmo.is.mfl.reports.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReportDto extends CrudDto {
  private int id;
  private int userId;
  private int reviewId;
  private int commentId;
  private String issue;
  private Date date;
}
