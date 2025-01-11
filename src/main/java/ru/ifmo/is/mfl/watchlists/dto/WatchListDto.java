package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.dto.UserDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class WatchListDto extends CrudDto {
  private int id;
  private UserDto user;
  private String name;
  private String photo;
  private boolean visibility;
  private int viewedCounter;
}
