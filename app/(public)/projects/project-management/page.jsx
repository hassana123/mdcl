import ProjectDisplay from "@/components/ProjectDisplay";
import projects from "@/data/projects";
import Link from "next/link";
export default function ProjectManagementPage() {
  return (
    <ProjectDisplay
      title="Project Management"
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
    description="Effective planning, monitoring, and evaluation are key to successful, goal-oriented, and sustainable project and programme outcomes."
      projects={projects["project-management"]}
      category="project-management"
      bannerImage="/mdcl/g4.jpg"
    />
  );
} 