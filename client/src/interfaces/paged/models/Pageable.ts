import Sort from './Sort';

export default interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort?: Sort | string;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
