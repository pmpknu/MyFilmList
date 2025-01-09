package ru.ifmo.is.mfl.movies;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.movies.dto.*;
import ru.ifmo.is.mfl.storage.StorageService;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class MovieMapper implements CrudMapper<Movie, MovieDto, MovieCreateDto, MovieUpdateDto> {

  @Autowired
  public StorageService storageService;

  public abstract Movie map(MovieCreateDto dto);

  @Mapping(
    target = "poster",
    expression = "java(storageService.getFileUrl(model.getPoster()))"
  )
  public abstract MovieDto map(Movie model);

  public abstract Movie map(MovieDto model);

  public abstract void update(MovieUpdateDto dto, @MappingTarget Movie model);
}
