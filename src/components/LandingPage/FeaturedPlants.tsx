import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // apna firebase config path yahan
import PlantCard from "../PlantsPortal/ExploreGarden/PlantCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";

// Plant ka type — apne actual fields ke hisaab se adjust karo
interface Plant {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function FeaturedPlants() {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [featured, setFeatured] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "plants"));
        const allPlants = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plant[];

        // Sirf pehle 4 plants featured section ke liye
        setFeatured(allPlants.slice(0, 4));
      } catch (err) {
        console.error("Plants fetch error:", err);
        setError("Plants load nahi ho sake. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <p>{error}</p>
          </div>
        )}

        {/* Plants Grid */}
        {!loading && !error && (
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
        )}

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