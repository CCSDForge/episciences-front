import { Swiper as SwiperReactLib, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Card, { SwiperCardType, SwiperCardContent } from '../SwiperCards/SwiperCard'
import './Swiper.scss'

interface ISwiperProps {
  id: string;
  type: SwiperCardType;
  slidesPerView: number;
  cards: SwiperCardContent[];
}

export default function Swiper({ id, type, slidesPerView, cards }: ISwiperProps): JSX.Element {
  return (
    <>
      <SwiperReactLib
        slidesPerView={slidesPerView}
        slidesPerGroup={3}
        spaceBetween={15}
        modules={[Pagination]}
        pagination={{
          el: `.${id}-pagination`
        }}
        onSlideChange={(swiper) => {
          const index = Math.floor(swiper.activeIndex / 3);
          const paginationContainer = document.querySelector(`.${id}-pagination`);

          if (paginationContainer) {
            const dots = paginationContainer.querySelectorAll('.swiper-pagination-bullet');

            dots.forEach((dot, i) => {
              if (i === index) {
                dot.classList.add('swiper-pagination-bullet-active');
              } else {
                dot.classList.remove('swiper-pagination-bullet-active');
              }
            });
          }
        }}
      >
        {cards.map((content: SwiperCardContent, key: number) => (
          <SwiperSlide key={key}>
            <Card type={type} content={content} />
          </SwiperSlide>
        ))}
      </SwiperReactLib>
      <div className={`${id}-pagination swiper-pagination`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className={`swiper-pagination-bullet ${index === 0 ? 'swiper-pagination-bullet-active' : ''}`}></span>
        ))}
      </div>
  </>
  )
}