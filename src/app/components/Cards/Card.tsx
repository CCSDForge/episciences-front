import ArticleCard, { IArticleCardProps } from "./ArticleCard/ArticleCard";
import BoardCard, { IBoardCardProps } from "./BoardCard/BoardCard";

export type ICardType = 'article' | 'board';

export type ICardContent = IArticleCardProps | IBoardCardProps;

export interface ICardProps {
  type: ICardType;
  content: ICardContent;
}

export default function Card({ type, content }: ICardProps): JSX.Element {
  if (type === 'board') {
    return <BoardCard {...content as IBoardCardProps} />
  }

  return <ArticleCard {...content as IArticleCardProps} />
}