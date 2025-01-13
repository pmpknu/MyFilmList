package ru.ifmo.is.mfl.reports.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.comments.dto.CommentDto;
import ru.ifmo.is.mfl.reviews.dto.ReviewDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReportDto extends CrudDto {
  private int id;
  private UserDto user;
  private ReviewDto review;
  private CommentDto comment;
  private boolean resolved;
  private UserDto resolver;
  private String issue;
  private String text;
  private Instant date;
}
