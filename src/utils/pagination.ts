export const DEFAULT_ITEMS_PER_PAGE = 30;

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
}