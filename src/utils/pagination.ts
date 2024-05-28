export const ITEMS_PER_PAGE = 10;

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
}