"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "../public/mdcl/logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutOpen(false);
      }
    }
    if (aboutOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [aboutOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about", hasDropdown: true },
    { label: "Our Solutions", href: "/solutions" },
    { label: "Projects & Programmes", href: "/projects", hasDropdown: true },
    { label: "Gallery", href: "/gallery" },
    { label: "Blogs", href: "/blogs" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="bg-[var(--color-primary-olive)] py-3 text-white text-[20px]">
        <div className="flex justify-between w-[85%] mx-auto">
          <small className="underline">info@microdevelopmentng.com</small>
          <small>Phone Numbers: +234(0)92920265, +234(0)8052026025</small>
        </div>
      </div>

      <nav className="flex w-[85%] mx-auto items-center justify-between">
        <div className="logo">
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>

        <div className="links">
          <ul className="flex text-[var(--color-link-inactive)] justify-center gap-4">
            {navItems.map(({ label, href, hasDropdown }) => {
              const isActive = pathname === href || (label === "About Us" && pathname.startsWith("/about"));
              if (label === "About Us") {
                return (
                  <li
                    key={href}
                    className="relative"
                    ref={aboutRef}
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <button
                      className={`flex items-center transition-colors focus:outline-none ${
                        isActive
                          ? "text-[var(--color-primary-olive)] font-bold"
                          : "text-[var(--color-link-inactive)]"
                      }`}
                      onClick={() => setAboutOpen((v) => !v)}
                      aria-haspopup="true"
                      aria-expanded={aboutOpen}
                      type="button"
                    >
                      {label}
                      <ChevronDown
                        strokeWidth={0.8}
                        size={20}
                        className={`ml-1 transition-transform ${aboutOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                    {/* Dropdown */}
                    {aboutOpen && (
                      <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded shadow-lg z-50 animate-fade-in">
                        <Link
                          href="/about/profile"
                          className={`block px-4 py-2 text-sm hover:bg-[var(--color-primary-olive)]/10 transition ${{
                            true: "font-bold text-[var(--color-primary-olive)]",
                          }[pathname === "/about/profile"]}`}
                          onClick={() => setAboutOpen(false)}
                        >
                          Company Profile
                        </Link>
                        <Link
                          href="/about/team"
                          className={`block px-4 py-2 text-sm hover:bg-[var(--color-primary-olive)]/10 transition ${{
                            true: "font-bold text-[var(--color-primary-olive)]",
                          }[pathname === "/about/team"]}`}
                          onClick={() => setAboutOpen(false)}
                        >
                          Our Team
                        </Link>
                      </div>
                    )}
                  </li>
                );
              }
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center transition-colors ${
                      isActive
                        ? "text-[var(--color-primary-olive)] font-bold"
                        : "text-[var(--color-link-inactive)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
