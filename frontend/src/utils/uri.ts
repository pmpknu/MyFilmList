export const sorting = (sortParams: string[]) =>
  sortParams.map(el => `sort=${el}`).join('&');

export const createCrudUri = (page: number, size: number, sort: string[]) =>
  `?page=${page}&size=${size}&${sorting(sort)}`;