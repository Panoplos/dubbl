import { Hero } from "@/components/landing/hero";
import { Modules } from "@/components/landing/modules";
import { Workflow } from "@/components/landing/workflow";
import { Developers } from "@/components/landing/developers";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <Modules />
      <Workflow />
      <Developers />
      <FAQ />
      <CTASection />
    </>
  );
}
