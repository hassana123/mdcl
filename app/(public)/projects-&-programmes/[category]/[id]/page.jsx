"use client"
export const dynamic = "force-dynamic"
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { use } from "react";

// Map URL-friendly category names to display names
const categoryMap = {
  'research': {
    title: 'Research Projects',
    subtitle: 'Explore our Research Projects',
    description: 'Discover our research projects and their impact on development.'
  },
  'project-management': {
    title: 'Project Management',
    subtitle: 'Our Project Management Initiatives',
    description: 'Learn about our project management approaches and success stories.'
  },
  'capacity-development': {
    title: 'Capacity Development',
    subtitle: 'Building Capabilities for the Future',
    description: 'Explore our capacity development programs and their outcomes.'
  }
};

export default function ProjectDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const { category, id } = unwrappedParams;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderDescriptionSection = (section) => {
    // First render the section title if it exists
    const renderTitle = () => {
      if (section.title) {
        return (
          <h3 className="text-lg font-semibold text-[var(--color-title-text)] mb-1">
            {section.title}
          </h3>
        );
      }
      return null;
    };

    // Then render the section content based on type
    const renderContent = () => {
      switch (section.type) {
        case 'bullet':
          return (
            <ul className="list-disc pl-6 space-y-2">
              {section.items?.map((item, index) => (
                <li key={index} className="space-y-1">
                  <div className={item.isBold ? 'font-bold' : ''}>
                    {item.text}
                    {item.description && item.position === 'inline' && (
                      <span className="font-normal text-gray-600">  {item.description}</span>
                    )}
                  </div>
                  {item.description && item.position === 'below' && (
                    <div className="text-gray-600 text-sm ml-4">{item.description}</div>
                  )}
                </li>
              ))}
            </ul>
          );
        case 'numbered':
          return (
            <ol className="list-decimal pl-6 space-y-2">
              {section.items?.map((item, index) => (
                <li key={index} className="space-y-1">
                  <div className={item.isBold ? 'font-bold' : ''}>
                    {item.text}
                    {item.description && item.position === 'inline' && (
                      <span className="font-normal text-gray-600">  {item.description}</span>
                    )}
                  </div>
                  {item.description && item.position === 'below' && (
                    <div className="text-gray-600 text-sm ml-4">{item.description}</div>
                  )}
                </li>
              ))}
            </ol>
          );
        case 'nested':
          return (
            <ul className="list-disc pl-6 space-y-2">
              {section.items?.map((item, index) => (
                <li key={index} className="space-y-1">
                  <div className={item.isBold ? 'font-bold' : ''}>
                    {item.text}
                    {item.description && item.position === 'inline' && (
                      <span className="font-normal text-gray-600">  {item.description}</span>
                    )}
                  </div>
                  {item.description && item.position === 'below' && (
                    <div className="text-gray-600 text-sm ml-4">{item.description}</div>
                  )}
                  {item.subItems?.length > 0 && (
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="text-gray-600">{subItem}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          );
        default:
          return <p className="text-gray-600">{section.description}</p>;
      }
    };

    return (
      <div className="mb-8">
        {renderTitle()}
        {renderContent()}
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
        title={project.title}
        subtitle={
          <span className="text-base font-medium">
            <Link href="/" className="hover:text-[var(--color-primary-olive)]">Home</Link>
            {' / '}
            <Link href="/projects-&-programmes" className="hover:text-[var(--color-primary-olive)]">Projects & Programmes</Link>
            {' / '}
            <Link 
              href={`/projects-&-programmes/${category}`} 
              className="hover:text-[var(--color-primary-olive)]"
            >
              {categoryMap[category]?.title || category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </span>
        }

      />
      <div className="py-12 md:w-[85%] w-[95%] mx-auto">
        <Link href={`/projects-&-programmes/${category}`} className="text-[var(--color-primary-olive)] font-semibold mb-6 inline-block">&larr; Back</Link>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-title-text)]">{project.title}</h1>
          
          {/* First Image */}
          {project.images && project.images.length > 0 && (
            <div className="relative w-[80%] mx-auto aspect-video mb-8 rounded-xl overflow-hidden">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                priorityw
                className="object-cover rounded-xl"
                
              />
            </div>
          )}

          {/* Text Content */}
          <div className="prose prose-lg max-w-none">
            {project.sections ? (
              project.sections.map((section, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  {renderDescriptionSection(section)}
                </div>
              ))
            ) : (
              <div className="text-[15px] text-gray-800 whitespace-pre-line leading-relaxed">
                {project.description}
              </div>
            )}
          </div>
        </div>

        {/* Additional Images Grid */}
        {project.images && project.images.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-[var(--color-title-text)]">Project Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.slice(1).map((img, idx) => (
                <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden group">
                  <Image
                    src={img}
                    alt={`${project.title} - Image ${idx + 2}`}
                    fill
                    className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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


// "use client"
// import { useEffect, useState } from "react";
// import Banner from "@/components/Banner";
// import Image from "next/image";
// import Link from "next/link";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { use } from "react";

// // Map URL-friendly category names to display names
// const categoryMap = {
//   'research': {
//     title: 'Research Projects',
//     subtitle: 'Explore our Research Projects',
//     description: 'Discover our research projects and their impact on development.'
//   },
//   'project-management': {
//     title: 'Project Management',
//     subtitle: 'Our Project Management Initiatives',
//     description: 'Learn about our project management approaches and success stories.'
//   },
//   'capacity-development': {
//     title: 'Capacity Development',
//     subtitle: 'Building Capabilities for the Future',
//     description: 'Explore our capacity development programs and their outcomes.'
//   }
// };

// export default function ProjectDetailsPage({ params }) {
//   const unwrappedParams = use(params);
//   const { category, id } = unwrappedParams;
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const renderDescriptionSection = (section) => {
//     // First render the section title if it exists
//     const renderTitle = () => {
//       if (section.title) {
//         return (
//           <h3 className="text-lg font-semibold text-[var(--color-title-text)] mb-1">
//             {section.title}
//           </h3>
//         );
//       }
//       return null;
//     };

//     // Then render the section content based on type
//     const renderContent = () => {
//       switch (section.type) {
//         case 'bullet':
//           return (
//             <ul className="list-disc pl-6 space-y-2">
//               {section.items?.map((item, index) => (
//                 <li key={index} className="space-y-1">
//                   <div className={item.isBold ? 'font-bold' : ''}>
//                     {item.text}
//                     {item.description && item.position === 'inline' && (
//                       <span className="font-normal text-gray-600">  {item.description}</span>
//                     )}
//                   </div>
//                   {item.description && item.position === 'below' && (
//                     <div className="text-gray-600 text-sm ml-4">{item.description}</div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           );
//         case 'numbered':
//           return (
//             <ol className="list-decimal pl-6 space-y-2">
//               {section.items?.map((item, index) => (
//                 <li key={index} className="space-y-1">
//                   <div className={item.isBold ? 'font-bold' : ''}>
//                     {item.text}
//                     {item.description && item.position === 'inline' && (
//                       <span className="font-normal text-gray-600">  {item.description}</span>
//                     )}
//                   </div>
//                   {item.description && item.position === 'below' && (
//                     <div className="text-gray-600 text-sm ml-4">{item.description}</div>
//                   )}
//                 </li>
//               ))}
//             </ol>
//           );
//         case 'nested':
//           return (
//             <ul className="list-disc pl-6 space-y-2">
//               {section.items?.map((item, index) => (
//                 <li key={index} className="space-y-1">
//                   <div className={item.isBold ? 'font-bold' : ''}>
//                     {item.text}
//                     {item.description && item.position === 'inline' && (
//                       <span className="font-normal text-gray-600">  {item.description}</span>
//                     )}
//                   </div>
//                   {item.description && item.position === 'below' && (
//                     <div className="text-gray-600 text-sm ml-4">{item.description}</div>
//                   )}
//                   {item.subItems?.length > 0 && (
//                     <ul className="list-disc pl-6 mt-1 space-y-1">
//                       {item.subItems.map((subItem, subIndex) => (
//                         <li key={subIndex} className="text-gray-600">{subItem}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           );
//         default:
//           return <p className="text-gray-600">{section.description}</p>;
//       }
//     };

//     return (
//       <div className="mb-8">
//         {renderTitle()}
//         {renderContent()}
//       </div>
//     );
//   };

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const projectRef = doc(db, 'projects', id);
//         const projectSnap = await getDoc(projectRef);
        
//         if (projectSnap.exists()) {
//           setProject({ id: projectSnap.id, ...projectSnap.data() });
//         } else {
//           setError("Project not found");
//         }
//       } catch (err) {
//         console.error("Error fetching project:", err);
//         setError("Failed to load project");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   if (loading) {
//     return (
//       <main className="md:w-[85%] w-[95%] mx-auto py-20 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-olive)] mx-auto"></div>
//       </main>
//     );
//   }

//   if (error || !project) {
//     return (
//       <main className="md:w-[85%] w-[95%] mx-auto py-20 text-center">
//         <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
//         <Link href="/projects" className="text-[var(--color-primary-olive)] underline">Back to Projects</Link>
//       </main>
//     );
//   }

//   const mainImages = project.images?.slice(0, 4) || [];
//   const additionalImages = project.images?.slice(4) || [];

//   return (
//     <main className="bg-white">
//       <Banner
//         title={project.title}
//         subtitle={
//           <span className="text-base font-medium">
//             <Link href="/" className="hover:text-[var(--color-primary-olive)]">Home</Link>
//             {' / '}
//             <Link href="/projects-&-programmes" className="hover:text-[var(--color-primary-olive)]">Projects & Programmes</Link>
//             {' / '}
//             <Link 
//               href={`/projects-&-programmes/${category}`} 
//               className="hover:text-[var(--color-primary-olive)]"
//             >
//               {categoryMap[category]?.title || category.charAt(0).toUpperCase() + category.slice(1)}
//             </Link>
//           </span>
//         }
//         image={project.images?.[0] || "/mdcl/g4.jpg"}
//       />
//       <div className="py-12 md:w-[85%] w-[95%] mx-auto">
//         <Link href={`/projects-&-programmes/${category}`} className="text-[var(--color-primary-olive)] font-semibold mb-6 inline-block">&larr; Back</Link>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-4">
//           {/* Left: Text */}
//           <div>
//             <h1 className="text-md md:text-xl font-bold mb-5 text-[var(--color-title-text)]">{project.title}</h1>
//             <div className="">
//               {project.sections ? (
//                 project.sections.map((section, index) => (
//                   <div key={index} className=" last:border-b-1  border-gray-300">
//                     {renderDescriptionSection(section)}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-[15px] text-gray-800 whitespace-pre-line leading-relaxed">
//                   {project.description}
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Right: Images */}
//           <div className="flex flex-col md:w-[70%] md:h-full md:mx-auto gap-6">
//             {mainImages.map((img, idx) => (
//               <div key={idx} className="relative w-full h-full rounded-xl overflow-hidden">
//                 <Image
//                   src={img}
//                   alt={project.title + ' image ' + (idx + 1)}
//                   fill
//                   loading="lazy"
//                   quality={100}
//                   className="object-cover rounded-xl"
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Additional Images Section */}
//         {additionalImages.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-2xl font-bold mb-8 text-[var(--color-title-text)]">More Project Images</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {additionalImages.map((img, idx) => (
//                 <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden">
//                   <Image
//                     src={img}
//                     alt={project.title + ' additional image ' + (idx + 5)}
//                     fill
//                     className="object-cover rounded-xl"
//                     sizes="(max-width: 768px) 100vw, 33vw"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// } 