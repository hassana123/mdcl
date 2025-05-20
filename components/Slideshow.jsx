"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
const Slideshow = () => {

const eventImages = Array.from({ length: 20 }, (_, i) => `/mdcl/gallery/g (${i + 1}).jpg`);

  return (
      <section className="w-full px-4 py-8 bg-white mt-10">
      
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full"
      >
        {eventImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-60 relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={src}
                alt={`Event Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  
  )
}

export default Slideshow