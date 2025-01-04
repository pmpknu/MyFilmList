package ru.ifmo.is.mfl.users;

import org.mapstruct.*;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.users.dto.*;

import java.util.stream.Collectors;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  imports = Collectors.class
)
public abstract class UserMapper implements CrudMapper<User, UserDto, UserUpdateDto, UserUpdateDto> {
  public abstract User map(UserUpdateDto dto);

  @Mapping(
    target = "roles",
    expression = "java(model.getRoles().stream().map(UserRole::getRole).collect(Collectors.toSet()))"
  )
  public abstract UserDto map(User model);

  public abstract User map(UserDto model);

  public abstract void update(UserUpdateDto dto, @MappingTarget User model);
}
