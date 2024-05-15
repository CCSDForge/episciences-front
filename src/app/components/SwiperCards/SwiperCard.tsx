import SwiperArticleCard, { ISwiperArticleCardProps } from "./SwiperArticleCard/SwiperArticleCard";
import SwiperBoardCard, { ISwiperBoardCardProps } from "./SwiperBoardCard/SwiperBoardCard";

export type ISwiperCardType = 'article' | 'board';

export type ISwiperCardContent = ISwiperArticleCardProps | ISwiperBoardCardProps;

export interface ISwiperCardProps {
  type: ISwiperCardType;
  content: ISwiperCardContent;
}

export default function Card({ type, content }: ISwiperCardProps): JSX.Element {
  if (type === 'board') {
    return <SwiperBoardCard {...content as ISwiperBoardCardProps} />
  }

  return <SwiperArticleCard {...content as ISwiperArticleCardProps} />
}