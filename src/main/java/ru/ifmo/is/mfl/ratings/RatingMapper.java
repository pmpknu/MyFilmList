package ru.ifmo.is.mfl.ratings;

import org.mapstruct.*;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.movies.MovieMapper;
import ru.ifmo.is.mfl.ratings.dto.*;
import ru.ifmo.is.mfl.users.UserMapper;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class, MovieMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class RatingMapper implements CrudMapper<Rating, RatingDto, RatingCreateDto, RatingUpdateDto> {
  public abstract Rating map(RatingCreateDto dto);

  public abstract RatingDto map(Rating model);

  public abstract RatingWithoutMovieDto mapNoMovies(Rating model);

  public abstract RatingWithoutUserDto mapNoUsers(Rating model);

  public abstract Rating map(RatingDto model);

  public abstract void update(RatingUpdateDto dto, @MappingTarget Rating model);
}
