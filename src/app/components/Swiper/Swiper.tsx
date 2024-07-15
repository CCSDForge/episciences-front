import { TFunction } from 'i18next';
import { Swiper as SwiperReactLib, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { AvailableLanguage } from '../../../utils/i18n';
import Card, { SwiperCardType, SwiperCardContent } from '../SwiperCards/SwiperCard'
import './Swiper.scss'

interface ISwiperProps {
  id: string;
  type: SwiperCardType;
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  slidesPerView: number;
  cards: SwiperCardContent[];
}

export default function Swiper({ id, type, language, t, slidesPerView, cards }: ISwiperProps): JSX.Element {
  return (
    <>
      <div className='swiper-page-wrapper'>
        <div className={`${id}-button-prev swiper-button-prev`}></div>
        <SwiperReactLib
          slidesPerView={slidesPerView}
          slidesPerGroup={3}
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
        >
          {cards.map((content: SwiperCardContent, key: number) => (
            <SwiperSlide key={key}>
              <Card language={language} t={t} type={type} content={content} />
            </SwiperSlide>
          ))}
        </SwiperReactLib>
        <div className={`${id}-button-next swiper-button-next`}></div>
      </div>
      <div className={`${id}-pagination swiper-pagination`}></div>
    </>
  )
}