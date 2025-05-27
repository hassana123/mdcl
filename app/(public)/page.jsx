
import HeroSection from "@/components/HeroSection";
import PreviewAboutUs from "@/components/PreviewAboutUs";
import PreviewSolutions from "@/components/PreviewSolutions";
import Partners from "@/components/Partners";
import Slideshow from "@/components/Slideshow";
import PreviewBlog from "@/components/PreviewBlog";
import PreviewNewsletter from "@/components/PreviewNewsletter";
import Contact from "@/components/Contact"; 
import PreviewProjects from "@/components/PreviewProjects";
export default function Home() {
  return (
    <main>
      <HeroSection/>
      <PreviewAboutUs/>
      <PreviewSolutions/>
      <PreviewProjects/>
      <Slideshow/>
      <Partners/>
      <PreviewBlog/>
      <PreviewNewsletter/>

      <Contact/>
    </main>
  );
}
