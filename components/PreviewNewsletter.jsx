import React from "react";

const newsletters = [
  {
    title: "MicroDevelopment Matters Vol 1",
    link: "#",
  },
  {
    title: "MicroDevelopment Matters Vol 2",
    link: "#",
  },
  {
    title: "MicroDevelopment Matters Vol 3",
    link: "#",
  },
];

const PreviewNewsletter = () => {
  return (
    <section className="w-full min-h-[600px] bg-[color:var(--color-primary-olive)]/20 py-16 px-2 flex flex-col items-center justify-center">
      {/* Heading and Description */}
      <h2 className="text-2xl uppercase md:text-3xl font-bold text-center mb-2 text-[color:var(--color-primary-olive)]">
        Subscribe to our newsletter
      </h2>
      <p className="text-base text-gray-700 text-center mb-8 max-w-2xl">
        Apart from our website and social media activities, our quarterly newsletter MicroDevelopment Matters is a major medium through which we engage with actors in the development world, disseminating information at a micro-level. We also interview entrepreneurs running businesses, and disseminate information relevant to different sector.
      </p>
      {/* Email Form */}
      <form className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 mb-12">
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
      {/* Newsletter Cards */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {newsletters.map((nl, idx) => (
          <div key={idx} className="bg-white/60 rounded-xl shadow p-5 flex flex-col items-center w-full md:w-1/3 max-w-xs mx-auto">
            <div className="w-full h-32 bg-gray-200 rounded mb-4" />
            <div className="font-semibold text-[var(--color-title-text)] text-base text-center mb-3">
              {nl.title}
            </div>
            <a
              href={nl.link}
              className="bg-[color:var(--color-primary-light-brown)]/90 text-white px-6 py-2 rounded font-semibold text-sm shadow hover:bg-[color:var(--color-primary-brown)] transition"
            >
              View Newsletter
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewNewsletter;