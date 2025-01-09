package ru.ifmo.is.mfl.reports.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReportDto extends CrudDto {
  private int id;
  private User user;
  private Integer reviewId;
  private Integer commentId;
  private boolean resolved;
  private String issue;
  private String text;
  private Instant date;
}
