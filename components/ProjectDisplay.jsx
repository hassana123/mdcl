import Banner from "./Banner";
import Partners from "./Partners";
import Link from "next/link";
import Image from "next/image";
import Deco from "./Deco";
const ProjectDisplay = ({
  title,
  subtitle,
  description,
  projects = [],
  category = "research",
  bannerImage = "/mdcl/g4.jpg",
}) => {
  return (
    <main className="bg-white min-h-screen">
      <Banner
        title={title}
        subtitle={subtitle}
        image={bannerImage}
      />
      <Deco/>
      {/* Floating Chat Button */}
      {/* <div className="fixed right-8 top-[340px] z-30 flex flex-col items-center">
        <button className="bg-[color:var(--color-primary-olive)] text-white w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg">
          <span className="text-2xl">💬</span>
          <span className="text-xs mt-1">Chat Us</span>
        </button>
      </div> */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-3 text-[var(--color-title-text)]">{title}</h1>
        <p className="text-md text-gray-700 text-center mb-10">{description}</p>
        <div className="border-l-2 border-[var(--color-primary-olive)] pl-4 mb-8">
          <span className="font-semibold text-[var(--color-title-text)]">Our {category} projects include:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {projects.map((proj) => (
            <div key={proj.id} className="flex flex-col">
              <div className="relative w-full h-60 rounded-xl overflow-hidden mb-3">
                <Image
                  src={proj.images[0]}
                  alt={proj.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <Link
                href={`/projects/${category}/${proj.id}`}
                className="font-semibold underline text-[var(--color-title-text)] mb-2 hover:text-[var(--color-primary-olive)]"
              >
                {proj.title}
              </Link>
              <p className="text-sm text-gray-700 mb-2">{proj.summary}</p>
              <Link
                href={`/projects/${category}/${proj.id}`}
                className="text-[var(--color-primary-brown)] text-sm font-semibold hover:underline mt-auto flex items-center gap-1"
              >
                Read More <span className="text-lg">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Partners />
    </main>
  );
};

export default ProjectDisplay; 