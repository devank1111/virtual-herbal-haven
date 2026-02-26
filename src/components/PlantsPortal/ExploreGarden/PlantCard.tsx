import { Link } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Plant } from "@/data/plants";

interface PlantCardProps {
  plant: Plant;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  index?: number;
}

export default function PlantCard({ plant, isBookmarked, onToggleBookmark, index = 0 }: PlantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group relative bg-gradient-card rounded-xl overflow-hidden shadow-botanical hover:shadow-botanical-lg transition-all duration-500 botanical-border"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={plant.image}
          alt={`${plant.name} - ${plant.scientificName}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleBookmark(plant.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              isBookmarked ? "fill-accent text-accent" : "text-foreground"
            }`}
          />
        </button>

        {/* Categories */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {plant.category.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-muted-foreground italic mb-1">{plant.scientificName}</p>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          {plant.name}
          <span className="text-muted-foreground font-body text-sm font-normal ml-2">
            {plant.hindiName}
          </span>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {plant.description}
        </p>

        <Link
          to={`/plant/${plant.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-herb-glow transition-colors group/link"
        >
          Explore Plant
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
