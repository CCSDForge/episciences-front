import { TFunction } from 'i18next';
import { isMobileOnly, isTablet } from 'react-device-detect';
import { Swiper as SwiperReactLib, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import caretLeft from '/icons/caret-left-red.svg';
import caretRight from '/icons/caret-right-red.svg';
import { AvailableLanguage } from '../../../utils/i18n';
import Card, { SwiperCardType, SwiperCardContent } from '../SwiperCards/SwiperCard'
import './Swiper.scss'

interface ISwiperProps {
  id: string;
  type: SwiperCardType;
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  slidesPerView: number;
  slidesPerGroup: number;
  cards: SwiperCardContent[];
}

export default function Swiper({ id, type, language, t, slidesPerView, slidesPerGroup, cards }: ISwiperProps): JSX.Element {
  const renderedCards = (): SwiperCardContent[] => {
    if (isMobileOnly) {
      return cards.slice(0, 4)
    }

    if (isTablet) {
      return cards.slice(0, 8)
    }

    return cards;
  }

  return (
    <>
      <div className='swiper-page-wrapper'>
        <div className={`${id}-button-prev swiper-button-prev`}>
          <img className='swiper-button-prev-icon' src={caretLeft} alt='Caret left icon' />
        </div>
        <SwiperReactLib
          slidesPerView={slidesPerView}
          slidesPerGroup={slidesPerGroup}
          spaceBetween={15}
          modules={[Pagination, Navigation]}
          pagination={{
            el: `.${id}-pagination`,
            clickable: true
          }}
          navigation={{
            prevEl: `.${id}-button-prev`,
            nextEl: `.${id}-button-next`,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2
            },
            1368: {
              slidesPerView: slidesPerView,
              slidesPerGroup: slidesPerGroup
            }
          }}
        >
          {renderedCards().map((content: SwiperCardContent, key: number) => (
            <SwiperSlide key={key}>
              <Card language={language} t={t} type={type} content={content} />
            </SwiperSlide>
          ))}
        </SwiperReactLib>
        <div className={`${id}-button-next swiper-button-next`}>
          <img className='swiper-button-next-icon' src={caretRight} alt='Caret right icon' />
        </div>
      </div>
      <div className={`${id}-pagination swiper-pagination`}></div>
    </>
  )
}