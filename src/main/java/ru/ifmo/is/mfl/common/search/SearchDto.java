package ru.ifmo.is.mfl.common.search;

import lombok.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
@Builder
public class SearchDto {
  @NotNull
  private List<SearchCriteria> searchCriteriaList;

  @NotNull
  private String dataOption;
}
