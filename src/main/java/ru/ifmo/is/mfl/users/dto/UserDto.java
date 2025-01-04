package ru.ifmo.is.mfl.users.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.userroles.Role;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserDto extends CrudDto {
  private int id;
  private String username;
  private String email;
  private String bio;
  private String photo;
  private Set<Role> roles;
}
