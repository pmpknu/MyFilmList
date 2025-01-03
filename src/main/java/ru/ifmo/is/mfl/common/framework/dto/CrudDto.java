package ru.ifmo.is.mfl.common.framework.dto;

import lombok.Getter;
import lombok.Setter;
import ru.ifmo.is.mfl.common.framework.Creatable;
import ru.ifmo.is.mfl.users.User;

@Getter
@Setter
public abstract class CrudDto implements Creatable {
  private User user;
}
