import React from "react";
import Banner from "@/components/Banner";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
const Contact = () => {
  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="Contact Us"
        subtitle={
          <span className="text-base text-white/70 font-medium">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/contact" className="text-white font-bold">
              Contact Us
            </Link>
          </span>
        }
        image="/mdcl/g1.jpg"
      />
      <section className="max-w-4xl mx-auto px-4 py-12">
        <form className="bg-white rounded-lg shadow-none mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-olive)]"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-olive)]"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-olive)]"
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-700">
              Comment or Message
            </label>
            <textarea
              placeholder="Write your message"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-olive)] resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[var(--color-primary-brown)] text-white font-semibold px-10 py-3 rounded-lg hover:bg-[var(--color-primary-olive)] transition-colors"
          >
            Submit
          </button>
        </form>
        <div className="bg-[url('/mdcl/bg1.png')] bg-cover bg-center rounded-xl  text-white flex flex-col w-[60%] py-10 items-center  mx-auto">
          <h2 className="text-lg font-bold mb-2 text-center">
            Contact Information
          </h2>
          <div className="mb-2 text-center">
            <div>
              Email:{" "}
              <a
                href="mailto:info@microdevelopmentng.com"
                className="underline"
              >
                info@microdevelopmentng.com
              </a>
            </div>
            <div>
              Phone number:{" "}
              <a href="tel:+234092920265" className="underline">
                +234(0)92920265
              </a>
              ,{" "}
              <a href="tel:+23408052026025" className="underline">
                +234(0)8052026025
              </a>
            </div>
            <div>Address: 28 Liverpool Street, Sun City Estate, Abuja</div>
          </div>
          <div className="w-full flex justify-center my-4">
            <Image
              src="/mdcl/map.png"
              alt="Map"
              width={350}
              height={120}
              className="rounded-lg border"
            />
          </div>
          <div className="mt-2 flex flex-col items-center">
            <span className="mb-2">Follow us on:</span>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
               <Twitter/>    </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Instagram/>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Facebook/>
              </a>
               <a
                href="#"
                aria-label="Linkedln"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Linkedin/>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
