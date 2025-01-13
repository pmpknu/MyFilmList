package ru.ifmo.is.mfl.reports;

import org.mapstruct.*;

import ru.ifmo.is.mfl.common.framework.CrudMapper;
import ru.ifmo.is.mfl.common.mapper.JsonNullableMapper;
import ru.ifmo.is.mfl.common.mapper.ReferenceMapper;

import ru.ifmo.is.mfl.comments.CommentMapper;
import ru.ifmo.is.mfl.reviews.ReviewMapper;
import ru.ifmo.is.mfl.users.UserMapper;
import ru.ifmo.is.mfl.reports.dto.*;

@Mapper(
  uses = { JsonNullableMapper.class, ReferenceMapper.class, UserMapper.class, ReviewMapper.class, CommentMapper.class },
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
  componentModel = MappingConstants.ComponentModel.SPRING,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class ReportMapper implements CrudMapper<Report, ReportDto, ReportCreateDto, ReportUpdateDto> {
  public abstract Report map(ReportCreateDto dto);

  public abstract ReportDto map(Report model);

  public abstract Report map(ReportDto model);

  public abstract void update(ReportUpdateDto dto, @MappingTarget Report model);
}
