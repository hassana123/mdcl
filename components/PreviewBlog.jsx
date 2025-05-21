import React from "react";
import Image from "next/image";

const blogs = [
  {
    image: "/mdcl/b1.jpg",
    title: "Educating Girls: A pathway to sustainable development",
    excerpt:
      "Although progress has been recorded in recent years, girls throughout the world have continually suffered severe disadvantage and marginalization in the education system in Sub-Saharan Africa. For example, an estimated 51 [...]",
    link: "#",
  },
  {
    image: "/mdcl/b2.jpg",
    title: "Is the nigeria coin lost and gone?",
    excerpt:
      "The main idea of having the coin as part of the Nigerian currency was to show the 'thrift' value of a naira. At the early stages of its introduction, the kobo [...]",
    link: "#",
  },
  {
    image: "/mdcl/b3.jpg",
    title: "My take on development",
    excerpt:
      "Philosophers, economists and political leaders have all shared their musings on the term 'development'. I believe human development is empowerment, it is about people taking control of their own [...]",
    link: "#",
  },
];

const PreviewBlog = () => {
  return (
    <section className="w-[85%] mx-auto mx-auto py-16  flex flex-col items-center">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] text-center mb-5">
       Blog Posts
      </h2>
      {/* <p className="text-base text-gray-700 text-center mb-6 max-w-xl">
        Here's a quick glance over our  blog posts and media articles
      </p> */}
      <button className="mb-10 bg-[var(--color-primary-light-brown)] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[color:var(--color-primary-brown)]/90 transition">
        View Blog
      </button>

      {/* Blog Cards */}
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {blogs.map((blog, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md flex-1 flex flex-col overflow-hidden max-w-sm mx-auto"
          >
            <div className="relative w-full h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={idx === 0}
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-[var(--color-title-text)] mb-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-700 flex-1 mb-4">
                {blog.excerpt}
              </p>
              <a
                href={blog.link}
                className="text-[color:var(--color-primary-olive)] font-semibold text-sm hover:underline mt-auto"
              >
                Read More &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewBlog;