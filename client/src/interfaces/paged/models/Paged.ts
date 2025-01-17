import Pageable from './Pageable';
import Sort from './Sort';

export default interface Paged<T> {
  totalElements: number;
  totalPages: number;
  pageable?: Pageable;
  size: number;
  content: T[];
  number: number;
  sort?: Sort;
  first?: boolean;
  last?: boolean;
  numberOfElements: number;
  empty?: boolean;
}
