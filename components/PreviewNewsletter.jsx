import React, { useState } from "react";
import Image from "next/image";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "@/lib/firebase";

const PreviewNewsletter = ({
  newsletters = [], // Accept newsletters array as prop
  limit = newsletters.length, // Accept limit as prop, default to all
  loading = false // Add loading prop
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      // Add email to the newsletter_subscribers collection
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email,
        subscribedAt: serverTimestamp(),
        status: 'active'
      });

      setStatus("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (err) {
      console.error("Error subscribing:", err);
      setStatus("Something went wrong. Please try again later.");
    }
    setIsSubmitting(false);
  };

  // Use the passed newsletters and apply limit
  const newslettersToDisplay = newsletters.slice(0, limit);

  if (loading) {
    return (
      <section className="w-full md:px-0 px-5 min-h-[600px] bg-[color:var(--color-primary-olive)]/20 py-5 flex flex-col items-center justify-center">
        {/* Heading and Description */}
        <h2 className="md:text-2xl text-md uppercase md:text-3xl font-bold text-center mb-2 text-[color:var(--color-primary-olive)]">
          Subscribe to our quarterly Newsletter: MICRODEVELOPMENT MATTERS
        </h2>
        <p className="text-base text-gray-700 text-center mb-8 max-w-2xl">
          <i> MicroDevelopment Matters </i>is our quarterly newsletter where we share insights on topical development issues at the grassroots level. Each edition features interviews with entrepreneurs and experts across various sectors, offering fresh perspectives and practical knowledge.
        </p>
        {/* Email Form */}
        <form className="w-full max-w-xl mx-auto md:flex items-center gap-2 mb-12">
          <input
            type="email"
            placeholder="Enter your email address..."
            className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]/60 text-sm bg-white"
            required
          />
          <button
            type="submit"
            className="bg-[color:var(--color-primary-olive)] text-white px-8 py-3 rounded-r-lg font-semibold text-base shadow hover:bg-[color:var(--color-primary-olive)] transition"
          >
            Subscribe
          </button>
        </form>
        {/* Loading Newsletter Cards */}
        <div className="md:w-[85%] w-[95%] mx-auto grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 justify-center items-stretch">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl shadow p-5 flex flex-col items-center animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full md:px-0 px-5 min-h-[600px] bg-[color:var(--color-primary-olive)]/20 py-5 flex flex-col items-center justify-center">
      {/* Heading and Description */}
      <h2 className="md:text-2xl text-md uppercase md:text-3xl font-bold text-center mb-2 text-[color:var(--color-primary-olive)]">
       Subscribe to our quarterly Newsletter: MICRODEVELOPMENT MATTERS
      </h2>
      <p className="text-base text-gray-700 text-center mb-8 max-w-2xl">
      <i> MicroDevelopment Matters </i>is our quarterly newsletter where we share insights on topical development issues at the grassroots level. Each edition features interviews with entrepreneurs and experts across various sectors, offering fresh perspectives and practical knowledge.      </p>
      {/* Email Form */}
      <form onSubmit={handleSubscribe} className="w-full max-w-xl mx-auto md:flex items-center gap-2 mb-12">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address..."
          className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]/60 text-sm bg-white"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[color:var(--color-primary-olive)] text-white px-8 py-3 rounded-r-lg font-semibold text-base shadow hover:bg-[color:var(--color-primary-olive)] transition disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status && (
        <div className={`text-center mb-8 ${status.includes("Thank you") ? "text-green-600" : "text-red-500"}`}>
          {status}
        </div>
      )}
      {/* Newsletter Cards */}
      <div className="md:w-[85%] w-[95%]  mx-auto grid md:grid-cols-2 lg:grid-cols-3  grid-cols-1 gap-5  justify-center items-stretch">
        {newslettersToDisplay.map((nl) => (
          <div key={nl.id} className="bg-white/60 rounded-xl shadow p-5 flex flex-col items-center ">
            {/* Display actual cover image if available */}
            {nl.coverImage ? (
              <div className="relative w-full h-32 rounded overflow-hidden mb-4">
                <Image
                  src={nl.coverImage}
                  alt={nl.title || 'Newsletter Cover'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              // Original placeholder if no image
              <div className="w-full h-32 bg-gray-200 rounded mb-4" />
            )}
           
            {/* Original title styling */}
            <div className="font-semibold text-[var(--color-title-text)] text-base text-center mb-3">
              {nl.title}
            </div>
            {/* Use actual PDF link */}
            {nl.pdfUrl && (
              <a
                href={nl.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[color:var(--color-primary-light-brown)]/90 text-white px-6 py-2 rounded font-semibold text-sm shadow hover:bg-[color:var(--color-primary-brown)] transition"
              >
                View Newsletter
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewNewsletter;