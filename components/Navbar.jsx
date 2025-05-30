"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "../public/mdcl/logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const resourcesRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(e.target) &&
        projectsRef.current &&
        !projectsRef.current.contains(e.target)
      ) {
        setAboutOpen(false);
        setProjectsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/what-we-are", hasDropdown: true },
    { label: "Our Solutions", href: "/solutions" },
    { label: "Projects & Programmes", href: "/projects-&-programmes", hasDropdown: true },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources", hasDropdown:true },
    { label: "Contact Us", href: "/contact" },
  ];

  const renderDropdown = (items, onClose) =>
    items.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="block px-4 py-2 text-sm hover:bg-[var(--color-primary-olive)]/10 transition"
        onClick={onClose}
      >
        {label}
      </Link>
    ));

  return (
    <header className="bg-[var(--color-primary-fuchia)]/60 border-b  border-[var(--color-primary-fuchia)] ">
      {/* Top bar */}
      {/* <div className="bg-[var(--color-primary-fuchia)] py-3 text-black text-[17px]">
        <div className="flex justify-between w-[90%] mx-auto">
          <small className="underline">info@microdevelopmentng.com</small>
          <small>Phone Numbers: +234(0)92920265, +234(0)8052026025</small>
        </div>
      </div> */}

      {/* Navbar */}
      <nav className="w-[90%]   mx-auto flex items-center justify-between ">
        {/* Logo */}
        <div>
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>

        {/* Desktop nav */}
        <ul className="hidden lg:flex gap-6 items-center text-[var(--color-link-inactive)]">
          {navItems.map(({ label, href, hasDropdown }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));


            if (label === "About Us") {
              return (
                <li key={label} ref={aboutRef} className="relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                      href={href}
                      className={`transition-colors ${
                        isActive ? "text-[var(--color-primary-olive)] font-bold" : ""
                      }`}
                    >
                      {label}
                    </Link>
                    <button
                      onClick={() => setAboutOpen((prev) => !prev)}
                      className="focus:outline-none"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${aboutOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>

                  {aboutOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                      {renderDropdown(
                        [
                          { href: "/about/what-we-are", label: "What We Are" },
                          { href: "/about/team", label: "Our Team" },
                        ],
                        () => setAboutOpen(false)
                      )}
                    </div>
                  )}
                </li>
              );
            }

            if (label === "Projects & Programmes") {
              return (
                <li key={label} ref={projectsRef} className="relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                      href={href}
                      className={`transition-colors ${
                        isActive ? "text-[var(--color-primary-olive)] font-bold" : ""
                      }`}
                    >
                      {label}
                    </Link>
                    <button
                      onClick={() => setProjectsOpen((prev) => !prev)}
                      className="focus:outline-none"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${projectsOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>

                  {projectsOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
                      {renderDropdown(
                        [
                          { href: "/projects-&-programmes/research", label: "Research Projects" },
                          { href: "/projects-&-programmes/project-management", label: "Project Management" },
                          { href: "/projects-&-programmes/capacity-development", label: "Capacity Development" },
                        ],
                        () => setProjectsOpen(false)
                      )}
                    </div>
                  )}
                </li>
              );
            }
if (label === "Resources") {
              return (
                <li key={label} ref={resourcesRef} className="relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                      href={href}
                      className={`transition-colors ${
                        isActive ? "text-[var(--color-primary-olive)] font-bold" : ""
                      }`}
                    >
                      {label}
                    </Link>
                    <button
                      onClick={() => setResourceOpen((prev) => !prev)}
                      className="focus:outline-none"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${resourceOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>

                  {resourceOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
                      {renderDropdown(
                        [
                          { href: "/resources/newsletter", label: "Newsletter" },
                          { href: "/resources/others", label: "Other Resources" },
                         
                        ],
                        () => resourceOpen(false)
                      )}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors ${
                    isActive ? "text-[var(--color-primary-olive)] font-bold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger */}
        <div className="lg:hidden">
          <button onClick={toggleMobile}>
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-6 pb-6 pt-2 border-t shadow-md">
          <ul className="flex flex-col gap-4 text-[var(--color-link-inactive)]">
            {navItems.map(({ label, href, hasDropdown }) => {
              if (label === "About Us") {
                return (
                  <li key={label} className="relative" ref={aboutRef}>
                    <div className="flex justify-between items-center">
                      <Link href={href} onClick={() => setMobileOpen(false)}>
                        {label}
                      </Link>
                      <button onClick={() => setAboutOpen((prev) => !prev)}>
                        <ChevronDown className={`${aboutOpen ? "rotate-180" : ""} transition-transform`} />
                      </button>
                    </div>
                    {aboutOpen && (
                      <div className="mt-1 ml-4 border-l pl-3">
                        {renderDropdown(
                          [
                            { href: "/about/profile", label: "Company Profile" },
                            { href: "/about/team", label: "Our Team" },
                          ],
                          () => setMobileOpen(false)
                        )}
                      </div>
                    )}
                  </li>
                );
              }

              if (label === "Projects & Programmes") {
                return (
                  <li key={label} className="relative" ref={projectsRef}>
                    <div className="flex justify-between items-center">
                      <Link href={href} onClick={() => setMobileOpen(false)}>
                        {label}
                      </Link>
                      <button onClick={() => setProjectsOpen((prev) => !prev)}>
                        <ChevronDown className={`${projectsOpen ? "rotate-180" : ""} transition-transform`} />
                      </button>
                    </div>
                    {projectsOpen && (
                      <div className="mt-1 ml-4 border-l pl-3">
                        {renderDropdown(
                          [
                            { href: "/projects/research", label: "Research Projects" },
                            { href: "/projects/management", label: "Project Management" },
                            { href: "/projects/capacity", label: "Capacity Development" },
                          ],
                          () => setMobileOpen(false)
                        )}
                      </div>
                    )}
                  </li>
                );
              }
              if (label === "Resources") {
                return (
                  <li key={label} className="relative" ref={projectsRef}>
                    <div className="flex justify-between items-center">
                      <Link href={href} onClick={() => setMobileOpen(false)}>
                        {label}
                      </Link>
                      <button onClick={() => setResourceOpen((prev) => !prev)}>
                        <ChevronDown className={`${resourceOpen ? "rotate-180" : ""} transition-transform`} />
                      </button>
                    </div>
                    {projectsOpen && (
                      <div className="mt-1 ml-4 border-l pl-3">
                        {renderDropdown(
                          [
                            { href: "/resources/newsletter", label: "Newsletter" },
                            { href: "/resources/other", label: "Others" },
                            
                          ],
                          () => setMobileOpen(false)
                        )}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={href}>
                  <Link href={href} onClick={() => setMobileOpen(false)}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
