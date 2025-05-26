"use client";
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react"; // Lucide icons

const Footer = () => {
  return (
    <footer className="w-full text-[16px] py-2 bg-[var(--color-primary-light-olive)]">
      {/* Top Row: Email and Phone */}
      <div className="md:flex space-y-5 justify-between items-center max-w-6xl mx-auto w-full mb-2 ">
        <span className="block">info@microdevelopmentng.com</span>
        <span className=" block">
          Phone Number: +234(0)92920265, +234(0)8052026025
        </span>
      </div>

      {/* Blue Dotted Divider */}
      <div className="w-full flex justify-center mb-2">
        <div className="border-t-1 border-[#000] w-full max-w-2xl" />
      </div>

      {/* Copyright and Socials */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-center ">
          &copy; Copyright 2023 |{" "}
          <span className="font-bold">
            MicroDevelopment Consulting Limited
          </span>
          . All rights reserved
        </div>

        <div className="flex gap-4 mt-1">
          <a
            href="#"
            className=" hover:text-[color:var(--color-primary-olive)] transition"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            className=" hover:text-[color:var(--color-primary-olive)] transition"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className=" hover:text-[color:var(--color-primary-olive)] transition"
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
