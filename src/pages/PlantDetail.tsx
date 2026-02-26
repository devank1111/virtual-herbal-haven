import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { plants } from "@/data/plants";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
import PlantDetailHero from "@/components/PlantsPortal/PlantDetailHero";
import PlantDetailSections from "@/components/PlantsPortal/PlantDetailSections";
import PlantVideos from "@/components/PlantsPortal/PlantVideos";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const plant = plants.find((p) => p.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  if (!plant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Plant Not Found
          </h1>
          <Link to="/garden" className="text-primary hover:text-herb-glow font-medium">
            ← Back to Garden
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${plant.name} - AYUSH Virtual Garden`,
        text: `Learn about ${plant.name} (${plant.scientificName}) and its medicinal properties.`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <PlantDetailHero
          plant={plant}
          isBookmarked={isBookmarked(plant.id)}
          onToggleBookmark={() => toggleBookmark(plant.id)}
          onShare={handleShare}
        />

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* AYUSH systems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <span className="text-sm font-medium text-muted-foreground">Used in:</span>
            {plant.ayushSystem.map((system) => (
              <span
                key={system}
                className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
              >
                {system}
              </span>
            ))}
          </motion.div>

          {/* Two-column layout: Info + 3D Model */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <PlantDetailSections plant={plant} />

            {/* 3D Model Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:sticky lg:top-28"
            >
              <PlantVideos plantId={plant.id} plantName={plant.name} />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
