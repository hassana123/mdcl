import ProjectDisplay from "@/components/ProjectDisplay";

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
      title="Project Management"
      subtitle={<span className="text-base font-medium">Home / Projects / Project Management</span>}
      description="Good planning and evaluation lead to successful, lasting projects. At MDCL, we support development agencies in designing, managing, and assessing social impact projects for better outcomes."
      projects={managementProjects}
      category="project-management"
      bannerImage="/mdcl/g4.jpg"
    />
  );
} 