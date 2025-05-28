"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Banner = ({
  title = "",
  subtitle = "",
  children,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of gallery images
  const galleryImages = [
    "/mdcl/gallery/g (1).jpg",
    "/mdcl/gallery/g (2).jpg",
    "/mdcl/gallery/g (3).jpg",
    "/mdcl/gallery/g (4).jpg",
    "/mdcl/gallery/g (5).jpg",
    "/mdcl/gallery/g (6).jpg",
    "/mdcl/gallery/g (7).jpg",
    "/mdcl/gallery/g (8).jpg",
    "/mdcl/gallery/g (9).jpg",
    "/mdcl/gallery/g (10).jpg",
    "/mdcl/gallery/g (11).jpg",
    "/mdcl/gallery/g (12).jpg",
    "/mdcl/gallery/g (13).jpg",
    "/mdcl/gallery/g (14).jpg",
    "/mdcl/gallery/g (15).jpg",
    "/mdcl/gallery/g (16).jpg",
    "/mdcl/gallery/g (17).jpg",
    "/mdcl/gallery/g (18).jpg",
    "/mdcl/gallery/g (19).jpg",
    "/mdcl/gallery/g (20).jpg",
  ];

  useEffect(() => {
    // Change image every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
      {/* Background Images with Transition */}
      <div className="absolute inset-0 w-full h-full">
        {galleryImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              // loading="lazy"
              quality={100}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center text-white px-4">
        {children}
        {title && (
          <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-base md:text-lg font-medium drop-shadow mb-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Navigation Dots */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </section>
  );
};

export default Banner;
