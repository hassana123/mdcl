import React, { useState } from "react";
import Image from "next/image";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { CheckCircle2, X, AlertCircle } from 'lucide-react';

const PreviewNewsletter = ({
  newsletters = [], // Accept newsletters array as prop
  limit = newsletters.length, // Accept limit as prop, default to all
  loading = false // Add loading prop
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isExistingSubscriber, setIsExistingSubscriber] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Validate email before proceeding
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setStatus("");
    setEmailError("");

    try {
      // Check if email already exists
      const subscribersRef = collection(db, 'newsletter_subscribers');
      const q = query(subscribersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsExistingSubscriber(true);
        setShowSuccessModal(true);
        setEmail("");
        setIsSubmitting(false);
        return;
      }

      // Add email to the newsletter_subscribers collection
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email,
        subscribedAt: serverTimestamp(),
        status: 'active'
      });

      setIsExistingSubscriber(false);
      setShowSuccessModal(true);
      setEmail("");
    } catch (err) {
      console.error("Error subscribing:", err);
      setStatus("Something went wrong. Please try again later.");
    }
    setIsSubmitting(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
    <section className="w-full md:px-0 px-5 min-h-[600px] bg-[color:var(--color-primary-olive)]/20 py-5 flex flex-col items-center justify-center relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slideUp">
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${isExistingSubscriber ? 'bg-yellow-100' : 'bg-green-100'} rounded-full flex items-center justify-center mb-6`}>
                {isExistingSubscriber ? (
                  <AlertCircle className="w-10 h-10 text-yellow-600" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isExistingSubscriber ? 'Already Subscribed!' : 'Subscription Successful!'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isExistingSubscriber 
                  ? "This email is already subscribed to our Newsletter."
                  : "Thank you for subscribing to our Newsletter."
                }
              </p>
              <button
                onClick={closeSuccessModal}
                className="bg-[color:var(--color-primary-olive)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[color:var(--color-primary-olive)]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Heading and Description */}
      <h2 className="md:text-2xl text-md uppercase md:text-3xl font-bold text-center mb-2 text-[color:var(--color-primary-olive)]">
       Subscribe to our quarterly Newsletter: MICRODEVELOPMENT MATTERS
      </h2>
      <p className="text-base text-gray-700 text-center mb-8 max-w-2xl">
      <i> MicroDevelopment Matters </i>is our quarterly newsletter where we share insights on topical development issues at the grassroots level. Each edition features interviews with entrepreneurs and experts across various sectors, offering fresh perspectives and practical knowledge.      </p>
      {/* Email Form */}
      <form onSubmit={handleSubscribe} className="w-full max-w-xl mx-auto md:flex flex-col items-center gap-2 mb-12">
        <div className="w-full flex flex-col">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address..."
              className={`flex-1 px-4 py-3 rounded-l-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]/60 text-sm bg-white`}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !!emailError}
              className="bg-[color:var(--color-primary-olive)] cursor-pointer text-white px-8 py-3 rounded-r-lg font-semibold text-base shadow hover:bg-[color:var(--color-primary-olive)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1 ml-1">{emailError}</p>
          )}
        </div>
      </form>
      {status && !showSuccessModal && (
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