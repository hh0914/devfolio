import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { profile, site } from '@/config';

export default function HomePage() {
  useDocumentMeta({
    title: `${profile.name} · ${profile.role}`,
    description: site.description,
  });

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
