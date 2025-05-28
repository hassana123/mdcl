"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
const heroImages = Array.from({ length: 20 }, (_, i) => `/mdcl/gallery/g (${i + 1}).jpg`);

const heroTitle = [
  "Empowering Women. Transforming Agriculture.",
  "Innovation. Climate Resilience. Access.",
];

const heroSubtitle = `Supporting and empowering women to thrive across agricultural systems and value chains by strengthening their digital and climate resilience skills, building their leadership capacity, and enhancing access to markets.`;

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative mt-3 w-full mx-auto flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute -left-5 -top-5 lg:block hidden">
        <svg
          width="152"
          height="366"
          viewBox="0 0 182 366"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M9.32761 23.4244C55.9985 -12.8246 123.218 -4.37603 159.467 42.2948C195.716 88.9657 187.268 156.185 140.597 192.434L-82.1174 365.415L-214 195.615L8.7142 22.6346L9.32761 23.4244Z"
            fill="#FCFCD9"
          />
        </svg>
      </div>
      <div className="absolute -right-5 -top-10 lg:block hidden">
        <svg
          width="202"
          height="325"
          viewBox="0 0 282 325"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <mask id="path-1-inside-1_325_848" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M59.3401 130.408L337.266 -7.95722e-06L423.921 184.68L145.996 315.088L135.132 320.186L134.835 319.554C86.434 335.704 32.5325 313.399 10.3277 266.076C-11.877 218.753 5.41743 163.042 48.7732 136.138L48.4765 135.506L59.3401 130.408Z"
              />
            </mask>
            <path
              d="M337.266 -7.95722e-06L347.224 -4.67261L342.551 -14.6309L332.593 -9.95826L337.266 -7.95722e-06ZM423.921 184.68L428.594 194.639L438.552 189.966L433.88 180.008L423.921 184.68ZM145.996 315.088L150.668 325.047L145.996 315.088ZM135.132 320.186L125.174 324.858L129.846 334.817L139.805 330.144L135.132 320.186ZM134.835 319.554L144.794 314.881L140.637 306.022L131.354 309.119L134.835 319.554ZM48.7732 136.138L54.5731 145.485L62.8884 140.325L58.7314 131.465L48.7732 136.138ZM48.4765 135.506L43.8039 125.547L33.8457 130.22L38.5183 140.178L48.4765 135.506ZM59.3401 130.408L64.0127 140.366L341.938 9.95824L337.266 -7.95722e-06L332.593 -9.95826L54.6674 120.45L59.3401 130.408ZM337.266 -7.95722e-06L327.308 4.6726L413.963 189.353L423.921 184.68L433.88 180.008L347.224 -4.67261L337.266 -7.95722e-06ZM423.921 184.68L419.249 174.722L141.323 305.13L145.996 315.088L150.668 325.047L428.594 194.639L423.921 184.68ZM145.996 315.088L141.323 305.13L130.46 310.228L135.132 320.186L139.805 330.144L150.668 325.047L145.996 315.088ZM135.132 320.186L145.09 315.513L144.794 314.881L134.835 319.554L124.877 324.226L125.174 324.858L135.132 320.186ZM134.835 319.554L131.354 309.119C88.183 323.524 40.0928 303.616 20.286 261.404L10.3277 266.076L0.369466 270.749C24.9722 323.182 84.685 347.884 138.317 329.988L134.835 319.554ZM10.3277 266.076L20.286 261.404C0.479154 219.191 15.9029 169.481 54.5731 145.485L48.7732 136.138L42.9732 126.791C-5.068 156.602 -24.2332 218.315 0.369466 270.749L10.3277 266.076ZM48.7732 136.138L58.7314 131.465L58.4348 130.833L48.4765 135.506L38.5183 140.178L38.8149 140.81L48.7732 136.138ZM48.4765 135.506L53.1491 145.464L64.0127 140.366L59.3401 130.408L54.6674 120.45L43.8039 125.547L48.4765 135.506Z"
              fill="#FF00FF"
              fillOpacity="0.2"
              mask="url(#path-1-inside-1_325_848)"
            />
          </g>
        </svg>
      </div>
      {/* Centered Text */}
      <div className="lg:w-[60%] md:w-[85%] md:px-0 px-3 flex flex-col items-center z-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] leading-snug mb-2">
          {heroTitle.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-5xl mb-2">
          {heroSubtitle}
        </p>
        <Link href={"/about"} className="bg-[color:var(--color-primary-light-brown)] text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-[color:var(--color-primary-brown)]/90 transition mb-2">
          Learn More
        </Link>
      </div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden z-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={2}
          centeredSlides
          loop
          autoplay={{ delay: 3500 }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full overflow-hidden"
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            // when window width is >= 1280px
            1280: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
          }}
        >
          {heroImages.map((src, index) => (
            <SwiperSlide
              key={index}
              className=""
            >
              <div
                className={`relative transition-transform w-full h-[350px] duration-500 rounded-[20px] overflow-hidden shadow-md
                ${index === activeIndex ? "scale-90 z-20" : "scale-70 z-10"}
                `}
              >
                <Image
                  src={src}
                  alt={`Hero Slide ${index + 1}`}
                  fill
                  className="object-cover rounded-[20px] transition-all"
                  priority={index === 0}
                  quality={100}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Floating Chat Button */}
      {/* <div className="fixed right-8 bottom-8 z-30 flex flex-col items-center">
        <button className="bg-[color:var(--color-primary-olive)] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg">
          <span className="text-2xl">💬</span>
          <span className="text-xs mt-1">Chat Us</span>
        </button>
      </div> */}
    </section>
  );
};

export default HeroSection;
