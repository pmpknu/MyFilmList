package ru.ifmo.is.mfl.watched.dto;

import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class WatchesDto extends CrudDto {
  private int id;
  private int userId;
  private int movieId;
  private Instant watchDate;
}
