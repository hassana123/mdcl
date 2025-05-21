import ProjectDisplay from "@/components/ProjectDisplay";
import Link from "next/link";
const managementProjects = [
  {
    id: "ngo-impact",
    title: "NGO Social Impact Project Management",
    image: "/mdcl/pm1.jpg",
    summary: "Managing and evaluating social impact projects for NGOs to ensure lasting results.",
  },
  {
    id: "agriculture-support",
    title: "Agriculture Support Project for Rural Women",
    image: "/mdcl/pm2.jpg",
    summary: "Supporting rural women in agriculture through project planning and management.",
  },
  {
    id: "community-health",
    title: "Community Health Initiative Project",
    image: "/mdcl/pm3.jpg",
    summary: "Project management for community health initiatives to improve local well-being.",
  },
];

export default function ProjectManagementPage() {
  return (
    <ProjectDisplay
      title="Projects"
      subtitle={ <span className="text-base font-medium text-white/70">
          <Link href={"/"} className="hover:underline">
            Home{" "}/ {" "} 
          </Link>
          <Link href={"/projects"} className="hover:underline">
            Projects{" "}/ {" "}
          </Link>
          <Link
            href={"/projects/project-management"}
            className="hover:underline text-white font-bold"
          >
            Project Management{" "}
          </Link>
        </span>}
      description="Good planning and evaluation lead to successful, lasting projects. At MDCL, we support development agencies in designing, managing, and assessing social impact projects for better outcomes."
      projects={managementProjects}
      category="project-management"
      bannerImage="/mdcl/g4.jpg"
    />
  );
} 