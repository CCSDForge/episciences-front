import { AvailableLanguage } from "../../../utils/i18n";
import SwiperArticleCard, { SwiperArticleCardProps } from "./SwiperArticleCard/SwiperArticleCard";
import SwiperBoardCard, { SwiperBoardCardProps } from "./SwiperBoardCard/SwiperBoardCard";

export type SwiperCardType = 'article' | 'board';

export type SwiperCardContent = SwiperArticleCardProps | SwiperBoardCardProps;

export interface ISwiperCardProps {
  type: SwiperCardType;
  language: AvailableLanguage;
  content: SwiperCardContent;
}

export default function Card({ type, language, content }: ISwiperCardProps): JSX.Element {
  if (type === 'board') {
    return <SwiperBoardCard language={language} member={content as SwiperBoardCardProps} />
  }

  return <SwiperArticleCard language={language} article={content as SwiperArticleCardProps} />
}