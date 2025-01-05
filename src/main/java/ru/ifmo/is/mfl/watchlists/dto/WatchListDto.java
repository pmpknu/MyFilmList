package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class WatchListDto extends CrudDto {
  private int id;
  private int userId;
  private String name;
  private boolean visibility;
}
