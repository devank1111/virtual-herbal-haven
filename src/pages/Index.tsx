import HeroSection from "@/components/HeroSection";
import FeaturedPlants from "@/components/FeaturedPlants";
import AboutSection from "@/components/AboutSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPlants />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
