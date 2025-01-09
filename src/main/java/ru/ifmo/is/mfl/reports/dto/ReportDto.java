package ru.ifmo.is.mfl.reports.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReportDto extends CrudDto {
  private int id;
  private Integer userId;
  private Integer reviewId;
  private Integer commentId;
  private String issue;
  private String text;
  private Instant date;
}
