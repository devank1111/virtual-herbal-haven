import HeroSection from "@/components/LandingPage/HeroSection";
import FeaturedPlants from "@/components/LandingPage/FeaturedPlants";
import IndiaMap from "@/components/LandingPage/IndiaMap";
import AboutSection from "@/components/LandingPage/AboutSection";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <IndiaMap />
        <FeaturedPlants />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
