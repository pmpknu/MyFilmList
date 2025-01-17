export default interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
  direction?: string;
  nullHandling?: string;
  ascending?: boolean;
  ignoreCase?: boolean;
  property?: string;
}
