import { useState, useMemo } from "react";
import { Search, Filter, Bookmark, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { plants, categories, type PlantCategory } from "@/data/plants";
import PlantCard from "@/components/PlantsPortal/PlantCard";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Garden() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlantCategory[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();

  const toggleCategory = (cat: PlantCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch =
        searchQuery === "" ||
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.hindiName.includes(searchQuery) ||
        plant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.medicinalUses.some((use) =>
          use.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        plant.category.some((cat) => selectedCategories.includes(cat));

      const matchesBookmark = !showBookmarked || bookmarks.includes(plant.id);

      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [searchQuery, selectedCategories, showBookmarked, bookmarks]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Explore the Garden
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our collection of medicinal plants. Search by name, property,
              or filter by category to find the herbs you're looking for.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 space-y-4"
          >
            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants by name, property, or use..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-botanical"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Filters:</span>
              </div>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  showBookmarked
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Bookmark className="w-3 h-3" />
                Bookmarked
              </button>
            </div>

            {/* Active filters display */}
            {(selectedCategories.length > 0 || showBookmarked || searchQuery) && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredPlants.length} plant{filteredPlants.length !== 1 ? "s" : ""} found
                </span>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setShowBookmarked(false);
                    setSearchQuery("");
                  }}
                  className="text-xs text-primary hover:text-herb-glow font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Plant Grid */}
          <AnimatePresence mode="wait">
            {filteredPlants.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredPlants.map((plant, i) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isBookmarked={isBookmarked(plant.id)}
                    onToggleBookmark={toggleBookmark}
                    index={i}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No plants found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
