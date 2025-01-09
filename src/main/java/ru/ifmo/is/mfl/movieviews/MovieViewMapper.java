package ru.ifmo.is.mfl.movieviews;

import org.mapstruct.*;

import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.movies.MovieMapper;
import ru.ifmo.is.mfl.movieviews.dto.*;
import ru.ifmo.is.mfl.users.UserMapper;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class, MovieMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class MovieViewMapper {

  public abstract MovieViewDto map(MovieView model);

  public abstract MovieViewWithoutMovieDto mapNoMovies(MovieView model);

  public abstract MovieViewWithoutUserDto mapNoUsers(MovieView model);
}
