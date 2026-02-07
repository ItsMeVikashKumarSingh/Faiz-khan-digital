import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import ResultsSection from "@/components/sections/ResultsSection";
import CoursesSection from "@/components/sections/CoursesSection";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import FloatingWhatsAppButton from "@/components/layout/FloatingWhatsAppButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PackagesSection />
      <ResultsSection />
      <CoursesSection />
      <VideoTestimonialsSection />
      <AboutSection />
      <ContactSection />
      <FloatingWhatsAppButton />
    </>
  );
}
