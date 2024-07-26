export const DEFAULT_ITEMS_PER_PAGE = 30;

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
}

export interface PaginatedResponseWithRange<T> extends PaginatedResponse<T> {
  'hydra:range'?: Range;
}

export interface Range {
  types?: string[];
  years?: number[];
}

export interface PaginatedResponseWithCount<T> extends PaginatedResponseWithRange<T> {
  'hydra:totalPublishedArticles'?: number;
}

export interface PaginatedResponseWithAuthorsRange<T> extends PaginatedResponse<T> {
  'hydra:range'?: Record<string, number>
}