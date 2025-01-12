package ru.ifmo.is.mfl.reviews;

import org.mapstruct.*;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.movies.MovieMapper;
import ru.ifmo.is.mfl.reviews.dto.*;
import ru.ifmo.is.mfl.users.UserMapper;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class, MovieMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class ReviewMapper implements CrudMapper<Review, ReviewDto, ReviewCreateDto, ReviewUpdateDto> {
  public abstract Review map(ReviewCreateDto dto);

  public abstract ReviewDto map(Review model);

  public abstract ReviewWithoutMovieDto mapNoMovies(Review model);

  public abstract ReviewWithoutUserDto mapNoUsers(Review model);

  public abstract Review map(ReviewDto model);

  public abstract void update(ReviewUpdateDto dto, @MappingTarget Review model);
}
