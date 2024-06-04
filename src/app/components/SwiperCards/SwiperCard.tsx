import SwiperArticleCard, { SwiperArticleCardProps } from "./SwiperArticleCard/SwiperArticleCard";
import SwiperBoardCard, { SwiperBoardCardProps } from "./SwiperBoardCard/SwiperBoardCard";

export type SwiperCardType = 'article' | 'board';

export type SwiperCardContent = SwiperArticleCardProps | SwiperBoardCardProps;

export interface ISwiperCardProps {
  type: SwiperCardType;
  content: SwiperCardContent;
}

export default function Card({ type, content }: ISwiperCardProps): JSX.Element {
  if (type === 'board') {
    return <SwiperBoardCard {...content as SwiperBoardCardProps} />
  }

  return <SwiperArticleCard {...content as SwiperArticleCardProps} />
}