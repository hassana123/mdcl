"use client"
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Twitter, Linkedin, Instagram, Facebook, CheckCircle2, MapPin } from "lucide-react";
import emailjs from '@emailjs/browser';
import styles from './contact.module.css';

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const formRef = useRef();

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
      };

      await emailjs.send(
        'service_u7o36lr',
        'template_trrww8g',
        templateParams,
        'fMDmIeULGLnsvqA7f'
      );

      setStatus("Your message has been sent successfully!");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
      setIsFlipped(true);
    } catch (err) {
      setStatus("Something went wrong. Please try again later.");
    }
    setLoading(false);
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
    <section className="md:w-[85%] w-[90%] mx-auto bg-white py-16 px-4 space-y-10 md:space-y-0 md:flex items-center justify-between">
      {/* Left: Contact Info Card */}
      <div className="bg-[url('/mdcl/bg1.png')] bg-cover bg-center text-white rounded-xl shadow-lg p-6 flex-1 max-w-md relative overflow-hidden">
        <h2 className="text-lg font-semibold mb-6">Contact Information</h2>
        <div className="text-sm mb-6 space-y-4">
          <div>Email: info@microdevelopmentng.com</div>
          <div>Phone number:+234(0)92920265, +234(0)8052026025</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>28 Liverpool Street, Sun City Estate, Abuja</span>
          </div>
        </div>
        <div 
          className="w-full h-40 rounded-lg overflow-hidden mb-4 relative cursor-pointer group"
          onClick={handleMapClick}
        >
          <Image
            src="/mdcl/map.png"
            alt="Map location"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium">Click to view on Google Maps</span>
          </div>
        </div>
        <span className="text-white text-sm">Follow us on:</span><br/>
        <div className="mt-2 flex items-center gap-2">
          <a 
            href="https://x.com/microdevconsult" 
            target="_blank"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"
          >
            <Twitter/>
          </a>
          <a 
            href="https://web.facebook.com/people/MicroDevelopment-Consulting-Limited/100063761342350/?_rdc=1&_rdr#"
            target="_blank"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"
          >
            <Facebook/>
          </a>
          <a 
            href="https://www.instagram.com/microdevelopmentng/"
            target="_blank"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"
          >
            <Instagram/>
          </a>
          <a 
            href="https://www.linkedin.com/company/microdevelopmentng/posts/?feedView=all"
            target="_blank"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"
          >
            <Linkedin/>
          </a>
        </div>
      </div>

      {/* Right: Contact Form with Flip Animation */}
      <div className={styles['perspective-1000']}>
        <div className={`${styles['transform-style-3d']} transition-transform duration-500 ${isFlipped ? styles['rotate-y-180'] : ''}`}>
          {/* Front of card - Contact Form */}
          <div className={styles['backface-hidden']}>
            <form ref={formRef} className="flex-1 max-w-lg bg-white rounded-xl shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
                required
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Comment or Message"
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm min-h-[80px]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[color:var(--color-primary-light-brown)] text-white px-8 py-2 rounded font-semibold text-base shadow hover:bg-[color:var(--color-primary-brown)]/90 transition self-start disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              {status && !isFlipped && <div className="mt-2 text-center font-semibold text-[color:var(--color-primary-olive)]">{status}</div>}
            </form>
          </div>

          {/* Back of card - Success Message */}
          <div className={`absolute top-0 left-0 w-full ${styles['backface-hidden']} ${styles['rotate-y-180']}`}>
            <div className="flex-1 max-w-lg bg-white rounded-xl shadow p-6 text-center">
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
    </section>
  );
};

export default Contact;