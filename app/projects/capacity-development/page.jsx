import ProjectDisplay from "@/components/ProjectDisplay";
import Link from "next/link";
const capacityProjects = [
  {
    id: "training-needs",
    title: "Training Needs Assessment for State Ministries",
    image: "/mdcl/capacity1.jpg",
    summary:
      "Assessment of training needs for state ministries to improve service delivery.",
  },
  {
    id: "workshop-leadership",
    title: "Leadership Workshop for Women in Agriculture",
    image: "/mdcl/capacity2.jpg",
    summary:
      "Workshop to build leadership capacity among women in agricultural value chains.",
  },
  {
    id: "mentorship-programme",
    title: "Mentorship Programme for Young Entrepreneurs",
    image: "/mdcl/capacity3.jpg",
    summary:
      "Mentorship and coaching for young entrepreneurs in the agricultural sector.",
  },
];

export default function CapacityDevelopmentPage() {
  return (
    <ProjectDisplay
      title="Projects"
      subtitle={
        <span className="text-base font-medium text-white/70">
          <Link href={"/"} className="hover:underline">
            Home{" "}/{" "}
          </Link>
          <Link href={"/projects"} className="hover:underline">
            Projects{" "}/{" "}
          </Link>
          <Link
            href={"/projects/capacity-development"}
            className="hover:underline text-white font-bold"
          >
            Capacity Development{" "}
          </Link>
        </span>
      }
      description="Strong institutions drive sustainable impact. MDCL helps organizations build capacity through needs assessments, training, mentorship, and tailored workshops to improve service delivery."
      projects={capacityProjects}
      category="capacity-development"
      bannerImage="/mdcl/g4.jpg"
    />
  );
}
