import ProjectDisplay from "@/components/ProjectDisplay";
import projects from "@/data/projects";
import Link from "next/link";
export default function ResearchProjectsPage() {
  return (
    <ProjectDisplay
      title="Research"
       subtitle={ <span className="text-base font-medium text-white/70">
          <Link href={"/"} className="hover:underline">
            Home{" "}/{" "}
          </Link>
          <Link href={"/projects-&-programmes"} className="hover:underline">
            Projects & Programmes{" "}/ {" "}
          </Link>
          <Link
            href={"/projects-&-programmes/research"}
            className="hover:underline text-white font-bold"
          >
            Research{" "}
          </Link>
        </span>}
      description="We promote evidence-based policy and practice through rigorous research. By collecting and analysing data, we generate knowledge that informs and strengthens the design and implementation of sustainable development initiatives."
      projects={projects.research}
      category="research"
     
    />
  );
} 