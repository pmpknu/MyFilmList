interface SearchCriteria {
  filterKey: string;
  operation: string;
  value: any;
  dataOption: string;
}

export interface SearchDto {
  searchCriteriaList: SearchCriteria[];
  dataOption: string;
}
