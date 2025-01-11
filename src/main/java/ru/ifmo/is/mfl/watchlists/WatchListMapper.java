package ru.ifmo.is.mfl.watchlists;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.storage.StorageService;
import ru.ifmo.is.mfl.users.UserMapper;
import ru.ifmo.is.mfl.watchlists.dto.*;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class WatchListMapper implements CrudMapper<WatchList, WatchListDto, WatchListCreateDto, WatchListUpdateDto> {

  @Autowired
  public StorageService storageService;

  public abstract WatchList map(WatchListCreateDto dto);

  @Mapping(target = "photo", expression = "java(storageService.getFileUrl(model.getPhoto()))")
  public abstract WatchListDto map(WatchList model);

  public abstract WatchList map(WatchListDto model);

  public abstract void update(WatchListUpdateDto dto, @MappingTarget WatchList model);
}
