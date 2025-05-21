import Banner from "@/components/Banner";
import Image from "next/image";
import Link from "next/link";
import projects from "@/data/projects";

export default function ProjectDetailsPage({ params }) {
  const { category, id } = params;
  const project = (projects[category] || []).find((p) => p.id === id);

  if (!project) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-[var(--color-primary-olive)] underline">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="Projects"
        subtitle={<span className="text-base font-medium">Home / Projects / {category.charAt(0).toUpperCase() + category.slice(1)}</span>}
        image="/mdcl/g4.jpg"
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href={`/projects/${category}`} className="text-[var(--color-primary-olive)] font-semibold mb-6 inline-block">&larr; Back</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-4">
          {/* Left: Text */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-title-text)]">{project.title}</h1>
            <div className="text-[15px] text-gray-800 whitespace-pre-line leading-relaxed">{project.description}</div>
          </div>
          {/* Right: Images */}
          <div className="flex flex-col gap-6">
            {project.images.map((img, idx) => (
              <div key={idx} className="relative w-full h-84 rounded-xl overflow-hidden ">
                <Image
                  src={img}
                  alt={project.title + ' image ' + (idx + 1)}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 