"use client";
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react"; // Lucide icons

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--color-primary-olive)] text-white pt-6 pb-3 px-2 text-xs md:text-sm">
      {/* Top Row: Email and Phone */}
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full mb-2 px-2">
        <span className="text-white">info@microdevelopmentng.com</span>
        <span className="text-white">
          Phone Number: +234(0)92920265, +234(0)8052026025
        </span>
      </div>

      {/* Blue Dotted Divider */}
      <div className="w-full flex justify-center mb-2">
        <div className="border-t-2 border-dotted border-[#ffff] w-full max-w-2xl" />
      </div>

      {/* Copyright and Socials */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-center text-white">
          &copy; Copyright 2023 |{" "}
          <span className="font-bold">
            MicroDevelopment Consulting Limited
          </span>
          . All rights reserved
        </div>

        <div className="flex gap-4 mt-1">
          <a
            href="#"
            className="text-white hover:text-[color:var(--color-primary-olive)] transition"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            className="text-white hover:text-[color:var(--color-primary-olive)] transition"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="text-white hover:text-[color:var(--color-primary-olive)] transition"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
