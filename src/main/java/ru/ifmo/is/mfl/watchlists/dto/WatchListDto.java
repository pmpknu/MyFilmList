package ru.ifmo.is.mfl.watchlists.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.users.User;

@Data
@EqualsAndHashCode(callSuper = true)
public class WatchListDto extends CrudDto {
  private int id;
  private User user;
  private String name;
  private String photo;
  private boolean visibility;
  private int viewedCounter;
}
