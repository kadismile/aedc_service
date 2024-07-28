export type AdvancedQueryResult<T> = {
  results: T[]
  count: number
  limit: number;
  page: number;
  prevPage: number;
  nextPage: number
};
