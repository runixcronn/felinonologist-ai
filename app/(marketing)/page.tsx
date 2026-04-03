import { HeroSection } from "@/app/components/sections/HeroSection";
import { ArticleSection } from "@/app/components/sections/ArticleSection";
import { BreedShowcase } from "@/app/components/sections/BreedShowcase";
import { ContactSection } from "@/app/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ArticleSection />
      <BreedShowcase />
      <ContactSection />
    </>
  );
}
