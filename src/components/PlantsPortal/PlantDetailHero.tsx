import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import type { Plant } from "@/data/plants";

interface PlantDetailHeroProps {
  plant: Plant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export default function PlantDetailHero({
  plant,
  isBookmarked,
  onToggleBookmark,
  onShare,
}: PlantDetailHeroProps) {
  return (
    <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
      <img
        src={plant.image}
        alt={`${plant.name} - ${plant.scientificName}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

      {/* Back button & actions */}
      <div className="absolute top-6 left-0 right-0 container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/garden"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Garden
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleBookmark}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this plant"}
          >
            <Bookmark
              className={`w-5 h-5 ${
                isBookmarked
                  ? "fill-accent text-accent"
                  : "text-foreground"
              }`}
            />
          </button>
          <button
            onClick={onShare}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Share this plant"
          >
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Plant name overlay */}
      <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {plant.category.map((cat) => (
              <span
                key={cat}
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/90 text-primary-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl font-bold mb-1"
            style={{ color: "hsl(42 50% 96%)" }}
          >
            {plant.name}
          </h1>
          <p className="text-lg italic" style={{ color: "hsl(42 30% 82%)" }}>
            {plant.scientificName} • {plant.hindiName}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
