import ProjectDisplay from "@/components/ProjectDisplay";
import projects from "@/data/projects";
import Link from "next/link";
export default function CapacityDevelopmentPage() {
  return (
    <ProjectDisplay
      title="Capacity Development"
      subtitle={
        <span className="text-base font-medium text-white/70">
          <Link href={"/"} className="hover:underline">
            Home{" "}/{" "}
          </Link>
          <Link href={"/projects-&-programmes"} className="hover:underline">
            Projects & Programmes{" "}/{" "}
          </Link>
          <Link
            href={"/projects-&-programmes/capacity-development"}
            className="hover:underline text-white font-bold"
          >
            Capacity Development{" "}
          </Link>
        </span>
      } description="Strengthening the skills and capabilities of institutions and personnel is essential for improving service delivery and ensuring the long-term success of development efforts."
      projects={projects["capacity-development"]}
      category="capacity-development"
     
    />
  );
}
