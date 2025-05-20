import React from "react";
import Image from "next/image";

const solutions = [
  {
    title: "Training and Capacity Development",
    description:
      "Mentorship, access to finance, digital platforms, and aggregation hubs for women-led agribusinesses, cooperatives, financial institutions.",
  },
  {
    title: "Consulting and Advisory Services",
    description:
      "Institutional capacity building, agribusiness development, and policy consulting to Governments, NGOs, development agencies, and private agribusinesses.",
  },
  {
    title: "Agribusiness Incubation & Market Linkage Services",
    description:
      "Mentorship, access to finance, digital platforms, and aggregation hubs for women-led agribusinesses, cooperatives, financial institutions.",
  },
  {
    title: "Research and Data Services",
    description:
      "Market research, feasibility studies, policy reports. Target audience – development agencies, government, and investors.",
  },

  {
    title: "Events and Conferences",
    description:
      "Industry events, networking summits, policy dialogues for development agencies, government, cooperatives, and corporate stakeholders.",
  },
];

const PreviewSolutions = () => {
  return (
    <section className="w-[85%] mx-auto my-10">
      <div className="grid grid-cols-2 space-y-8">
        <h3 className="text-[40px] uppercase w-[60%] font-bold text-[var(--color-primary-olive)]">
          The Solutions we Offer
        </h3>
        {solutions.map((solution, index) => (
          <div className="w-[70%] space-y-2" key={index}>
            <h4 className="text-[#323539] font-bold">{solution.title}</h4>
            <p className="text-[#191720] text-justify">
              {solution.description}
            </p>
          </div>
        ))}
      </div>
          </section>
  );
};

export default PreviewSolutions;
