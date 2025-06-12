"use client"
import React, { useState, useRef } from "react";
import Banner from "@/components/Banner";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Facebook, Instagram, CheckCircle2, MapPin } from "lucide-react";
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './contact.module.css';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const templateParams = {
        from_name: `${form.firstName} ${form.lastName}`,
        from_email: form.email,
        message: form.message,
        to_name: "MicroDevelopment",
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_u7o36lr',
        'template_trrww8g',
        templateParams,
        'fMDmIeULGLnsvqA7f'
      );

      // Store message in Firestore
      await addDoc(collection(db, 'contactMessages'), {
        from_name: `${form.firstName} ${form.lastName}`,
        from_email: form.email,
        message: form.message,
        isRead: false,
        timestamp: serverTimestamp()
      });

      setForm({ firstName: "", lastName: "", email: "", message: "" });
      setIsFlipped(true);
    } catch (err) {
      console.error("Error sending email:", err);
      setStatus("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsFlipped(false);
    setStatus("");
  };

  const handleMapClick = () => {
    // Open Google Maps in a new tab with the location
    const address = "28 Liverpool Street, Sun City Estate, Abuja";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

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
      />
      <section className="md:w-[85%] w-[95%] mx-auto  py-12">
        <div className={styles['perspective-1000']}>
          <div className={`${styles['transform-style-3d']} transition-transform duration-500 ${isFlipped ? styles['rotate-y-180'] : ''}`}>
            {/* Front of card - Contact Form */}
            <div className={styles['backface-hidden']}>
              <form ref={formRef} className=" md:w-[65%] mx-auto bg-white rounded-lg shadow-none mb-12" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[color:var(--color-primary-light-brown)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[color:var(--color-primary-olive)] transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
                {status && !isFlipped && (
                  <div className="mt-4 text-center font-semibold text-[color:var(--color-primary-olive)]">
                    {status}
                  </div>
                )}
              </form>
            </div>

            {/* Back of card - Success Message */}
            <div className={`absolute top-0 left-0 w-full ${styles['backface-hidden']} ${styles['rotate-y-180']}`}>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                  <CheckCircle2 className="w-16 h-16 text-[color:var(--color-primary-olive)]" />
                </div>
                <h3 className="text-2xl font-bold text-[color:var(--color-title-text)] mb-4">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-8">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-[color:var(--color-primary-light-brown)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[color:var(--color-primary-olive)] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[url('/mdcl/bg1.png')] bg-cover bg-center rounded-xl  text-white flex flex-col md:w-[65%]  py-10 items-center  mx-auto">
          <h2 className="text-lg font-bold mb-2 text-center">
            Contact Information
          </h2>
          <div className="mb-2 text-center">
            <div>
              Email: {" "}
              <a
                href="mailto:info@microdevelopmentng.com"
                className="underline"
              >
                info@microdevelopmentng.com
              </a>
            </div>
            <div>
              Phone number: {" "}
              <a href="tel:+234092920265" className="underline">
                +234(0)92920265
              </a>
              , {" "}
              <a href="tel:+23408052026025" className="underline">
                +234(0)8052026025
              </a>
            </div>
            <div>Address: 28 Liverpool Street, Sun City Estate, Abuja</div>
          </div>
          <div 
            className="w-full flex justify-center my-4 cursor-pointer"
            onClick={handleMapClick}
          >
            <div className="relative group">
              <Image
                src="/mdcl/map.png"
                alt="Map"
                width={350}
                height={120}
                className="rounded-lg border transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute group-hover:scale-105  inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <span className="text-white font-medium">Click to view on Google Maps</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center">
            <span className="mb-2">Follow us on:</span>
            <div className="flex gap-4">
              <a
                target="_blank"
                href="https://x.com/microdevconsult"
                aria-label="Twitter"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Twitter />    </a>
              <a
                target="_blank"
                href="https://www.instagram.com/microdevelopmentng/"
                aria-label="Instagram"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Instagram />
              </a>
              <a
              target="_blank"
                href="https://web.facebook.com/people/MicroDevelopment-Consulting-Limited/100063761342350/?_rdc=1&_rdr#"
                aria-label="Facebook"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Facebook />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/microdevelopmentng/posts/?feedView=all"
                aria-label="Linkedln"
                className="hover:text-[var(--color-primary-light-olive)]"
              >
                <Linkedin />
              </a>
            </div>
          </div>
        </div>      </section>
    </main>
  );
};

export default Contact;
