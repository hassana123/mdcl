import Banner from "../../components/Banner";
import Deco from "@/components/Deco";
import PreviewProjects from "@/components/PreviewProjects";
import Partners from "@/components/Partners";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="Projects"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/projects" className="hover:underline text-white font-bold">Projects</Link>
          </span>
        }
        image="/mdcl/g4.jpg"
      />
      <Deco />
      <div className="mt-20 mb-10 text-center">
        <h1 className="uppercase text-2xl mb-5 font-bold text-[var(--color-title-text)]">Projects</h1>
        <p className="text-md text-gray-700">Our services are designed to meet the evolving needs of development actors.</p>
      </div>
      <PreviewProjects />
      <Partners />
    </main>
  );
}
