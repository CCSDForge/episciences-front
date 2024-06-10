import { FetchedArticle } from '../../../utils/article';

export interface IArticleState {
  articles: {
    data: FetchedArticle[];
    totalItems: number;
  }
}