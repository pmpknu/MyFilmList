package ru.ifmo.is.mfl.comments;

import org.mapstruct.*;

import ru.ifmo.is.mfl.comments.dto.*;
import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;
import ru.ifmo.is.mfl.users.UserMapper;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class CommentMapper implements CrudMapper<Comment, CommentDto, CommentCreateDto, CommentUpdateDto> {

  public abstract Comment map(CommentCreateDto dto);

  @Mapping(source = "review.id", target = "reviewId")
  @Mapping(source = "watchList.id", target = "watchListId")
  @Mapping(source = "movie.id", target = "movieId")
  public abstract CommentDto map(Comment model);

  @Mapping(source = "review.id", target = "reviewId")
  @Mapping(source = "watchList.id", target = "watchListId")
  @Mapping(source = "movie.id", target = "movieId")
  public abstract CommentWithoutUserDto mapNoUsers(Comment model);

  @Mapping(target = "review.id", source = "reviewId")
  @Mapping(target = "watchList.id", source = "watchListId")
  @Mapping(target = "movie.id", source = "movieId")
  public abstract Comment map(CommentDto model);

  public abstract void update(CommentUpdateDto dto, @MappingTarget Comment model);
}
