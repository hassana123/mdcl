"use client"
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { use } from "react";

export default function ProjectDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const { category, id } = unwrappedParams;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderDescriptionSection = (section) => {
    if (!section) return null;

    const formatContent = (content) => {
      if (Array.isArray(content)) {
        return (
          <ul className="list-disc pl-6 space-y-2">
            {content.map((item, index) => (
              <li key={index} className="whitespace-pre-line">
                {item}
              </li>
            ))}
          </ul>
        );
      }

      // Check if content contains numbered list pattern (e.g., "1. ", "2. ", etc.)
      if (content.match(/^\d+\.\s/m)) {
        const items = content.split(/\n/).filter(item => item.trim());
        return (
          <ol className="list-decimal pl-6 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="whitespace-pre-line">
                {item.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
        );
      }

      // Check if content contains bullet points (•, -, *, etc.)
      if (content.match(/^[•\-\*]\s/m)) {
        const items = content.split(/\n/).filter(item => item.trim());
        return (
          <ul className="list-disc pl-6 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="whitespace-pre-line">
                {item.replace(/^[•\-\*]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Regular text content
      return <div className="whitespace-pre-line">{content}</div>;
    };

    return (
      <div key={section.id || Math.random()} className="mb-6">
        {section.title && (
          <h3 className="text-lg font-semibold mb-3 text-[var(--color-title-text)]">
            {section.title}
          </h3>
        )}
        {section.description && (
          <div className="text-[15px] text-gray-800 leading-relaxed">
            {formatContent(section.description)}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projects', id);
        const projectSnap = await getDoc(projectRef);
        
        if (projectSnap.exists()) {
          setProject({ id: projectSnap.id, ...projectSnap.data() });
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="md:w-[85%] w-[95%] mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-olive)] mx-auto"></div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="md:w-[85%] w-[95%] mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-[var(--color-primary-olive)] underline">Back to Projects</Link>
      </main>
    );
  }

  const mainImages = project.images?.slice(0, 4) || [];
  const additionalImages = project.images?.slice(4) || [];

  return (
    <main className="bg-white">
      <Banner
        title="Projects"
        subtitle={<span className="text-base font-medium">Home / Projects / {category.charAt(0).toUpperCase() + category.slice(1)}</span>}
        image="/mdcl/g4.jpg"
      />
      <div className="py-12 md:w-[85%] w-[95%] mx-auto">
        <Link href={`/projects/${category}`} className="text-[var(--color-primary-olive)] font-semibold mb-6 inline-block">&larr; Back</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-4">
          {/* Left: Text */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-title-text)]">{project.title}</h1>
            <div className="space-y-6">
              {project.sections ? (
                project.sections.map(section => renderDescriptionSection(section))
              ) : (
                <div className="text-[15px] text-gray-800 whitespace-pre-line leading-relaxed">
                  {project.description}
                </div>
              )}
            </div>
          </div>
          {/* Right: Images */}
          <div className="flex flex-col md:w-[70%] md:h-[100vh] md:mx-auto gap-6">
            {mainImages.map((img, idx) => (
              <div key={idx} className="relative w-full h-84 rounded-xl overflow-hidden">
                <Image
                  src={img}
                  alt={project.title + ' image ' + (idx + 1)}
                  fill
                  loading="lazy"
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Images Section */}
        {additionalImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-[var(--color-title-text)]">More Project Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalImages.map((img, idx) => (
                <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={project.title + ' additional image ' + (idx + 5)}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 