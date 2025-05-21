import ProjectDisplay from "@/components/ProjectDisplay";
import Link from "next/link";
const researchProjects = [
  {
    id: "cbn-microfinance",
    title: "Central Bank of Nigeria (CBN): Impact Assessment of the Microfinance Policy, Regulatory and Supervisory Framework on the Nigerian Economy",
    image: "/mdcl/g1.jpg",
    summary: "Impact assessment of Nigeria's Microfinance Policy, Regulatory and Supervisory Framework, focusing on financial access and women's inclusion.",
  },
  {
    id: "cadp-market-info",
    title: "World Bank-Assisted Commercial Agriculture Development Project (CADP): Development of Market Information Kiosks in Kaduna State",
    image: "/mdcl/g2.png",
    summary: "Development of market information kiosks to support commercial agriculture in Kaduna State.",
  },
  {
    id: "kastelea-baseline",
    title: "Kaduna State Traffic and Environmental Law Enforcement Agency (KASTELEA) Baseline Survey",
    image: "/mdcl/g3.jpg",
    summary: "Baseline survey for KASTELEA to assess traffic and environmental law enforcement.",
  },
  {
    id: "mbit-entrepreneurship",
    title: "Kaduna State Ministry of Business, Innovation and Technology (MBIT): Impact assessment of Kaduna State Government's Entrepreneurship Programmes",
    image: "/mdcl/g4.jpg",
    summary: "Impact assessment of entrepreneurship programmes in Kaduna State.",
  },
];

export default function ResearchProjectsPage() {
  return (
    <ProjectDisplay
      title="Projects"
      subtitle={ <span className="text-base font-medium text-white/70">
          <Link href={"/"} className="hover:underline">
            Home{" "}/{" "}
          </Link>
          <Link href={"/projects"} className="hover:underline">
            Projects{" "}/ {" "}
          </Link>
          <Link
            href={"/projects/research"}
            className="hover:underline text-white font-bold"
          >
            Research{" "}
          </Link>
        </span>}
      description="We believe in driving evidence-based policy through actionable research. By supporting organizations to conduct studies, gathering data, and turning insights into impactful programs and reports."
      projects={researchProjects}
      category="research"
      bannerImage="/mdcl/g4.jpg"
    />
  );
} 