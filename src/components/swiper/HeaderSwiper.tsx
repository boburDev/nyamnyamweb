"use client"

import Slider from "react-slick";
import SwipeImg from '@/assets/images/swipe1.png'
import SwipeImg2 from '@/assets/images/swipe3.png'
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  { id: 1, img: SwipeImg },
  { id: 2, img: SwipeImg2 },
  // { id: 3, img: SwipeImg },
  // { id: 4, img: SwipeImg },
  // { id: 5, img: SwipeImg },
  // { id: 6, img: SwipeImg },
  // { id: 7, img: SwipeImg },
  // { id: 8, img: SwipeImg },
  // { id: 9, img: SwipeImg },
  // { id: 10, img: SwipeImg },
]

const HeaderSwiper = () => {

  const isSingle = slides.length === 1;

  
  const settings = {
    infinite: !isSingle, 
    centerMode: !isSingle,
    centerPadding: isSingle ? "0px" : "20%", 
    slidesToShow: 1,
    autoplay: !isSingle,
    autoplaySpeed: 3000,
    speed: 800,
    dots: !isSingle,
    arrows: false,

    
    customPaging: () => (
      <div className="w-[16px] h-[8px] rounded-[5px] bg-[#E0E0E0]" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div style={{ marginTop: "20px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="px-2">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
               priority
                src={slide.img}
                alt="slide"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-dots li.slick-active div {
          background: #4fb477 !important;
        }
      `}</style>
    </div>
  )
}

export default HeaderSwiper
