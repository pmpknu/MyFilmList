import { SearchCriteria } from './SearchCriteria';

export interface SearchDto {
  dataOption: 'all' | 'any';
  searchCriteriaList: SearchCriteria[];
}
