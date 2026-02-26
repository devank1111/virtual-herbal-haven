import { motion } from "framer-motion";
import { plants } from "@/data/plants";
import PlantCard from "../PlantsPortal/PlantCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FeaturedPlants() {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const featured = plants.slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Featured Herbs
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
            Nature's Most Powerful Healers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover some of the most revered medicinal plants from the AYUSH tradition,
            each carrying centuries of healing wisdom.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((plant, i) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              isBookmarked={isBookmarked(plant.id)}
              onToggleBookmark={toggleBookmark}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/garden"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
          >
            View All Plants
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
