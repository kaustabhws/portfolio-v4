import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSiteData } from "@/lib/data";

// Render per-request so CMS edits show up immediately (and so the build
// never tries to reach the database during static prerendering).
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();

  return (
    <>
      <CustomCursor />
      <Navbar firstName={data.profile.firstName} location={data.profile.location} />
      <main>
        <Hero profile={data.profile} />
        <Marquee items={data.marqueeSkills} />
        <About
          profile={data.profile}
          stats={data.stats}
          aboutImage={data.aboutImage}
        />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Education education={data.education} />
        <Services services={data.services} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </>
  );
}
