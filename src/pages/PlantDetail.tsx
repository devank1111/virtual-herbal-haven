import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Leaf,
  MapPin,
  AlertTriangle,
  Lightbulb,
  Pill,
  Scissors,
  Sparkles,
} from "lucide-react";
import { plants } from "@/data/plants";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const sections = [
    {
      icon: Leaf,
      title: "Description",
      content: plant.description,
    },
    {
      icon: MapPin,
      title: "Habitat & Growing Conditions",
      content: plant.habitat,
    },
    {
      icon: Pill,
      title: "Medicinal Uses",
      content: null,
      list: plant.medicinalUses,
    },
    {
      icon: Scissors,
      title: "Parts Used",
      content: plant.partsUsed.join(" • "),
    },
    {
      icon: Sparkles,
      title: "Preparation Methods",
      content: plant.preparation,
    },
    {
      icon: AlertTriangle,
      title: "Precautions",
      content: plant.precautions,
    },
    {
      icon: Lightbulb,
      title: "Fun Fact",
      content: plant.funFact,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero */}
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
                onClick={() => toggleBookmark(plant.id)}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                aria-label={isBookmarked(plant.id) ? "Remove bookmark" : "Bookmark this plant"}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isBookmarked(plant.id)
                      ? "fill-accent text-accent"
                      : "text-foreground"
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
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

          {/* Info sections */}
          <div className="grid gap-6 max-w-3xl">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-xl bg-card shadow-botanical botanical-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>

                {section.content && (
                  <p className="text-muted-foreground leading-relaxed pl-12">
                    {section.content}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-2 pl-12">
                    {section.list.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
