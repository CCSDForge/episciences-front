export type NotFoundReason =
  | 'section-wrong-journal'
  | 'article-wrong-journal'
  | 'volume-wrong-journal'
  | 'not-found'
  | 'access-denied';

export interface NotFoundState {
  reason?: NotFoundReason;
  details?: {
    resourceType?: string;
    resourceId?: string;
  };
}