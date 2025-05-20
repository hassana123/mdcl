import React from "react";
import Image from "next/image";

const Banner = ({
  title = "",
  subtitle = "",
  image = "/mdcl/blog-banner.jpg", // default image path
  children,
}) => {
  return (
    <section className="relative w-full h-[260px]  flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-[300px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center text-white px-4">
        {children}
        {title && (
          <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{title}</h1>
        )}
        {subtitle && (
          <p className="text-base md:text-lg font-medium drop-shadow mb-2">{subtitle}</p>
        )}
      </div>
      
    </section>
  );
};

export default Banner;