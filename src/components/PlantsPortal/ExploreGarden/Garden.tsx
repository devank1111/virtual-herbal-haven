import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Bookmark, X, Leaf, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PlantCard from "@/components/PlantsPortal/ExploreGarden/PlantCard";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
import { useBookmarks } from "@/hooks/useBookmarks";

export type PlantCategory = string;

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  description: string;
  image: string;
  category: string | string[];
  medicinalUses: string[];
  diseases?: string[]; // optional field for disease-based search
}

// Common diseases / conditions for quick search suggestions
const DISEASE_SUGGESTIONS = [
  "Diabetes", "Fever", "Cold", "Cough", "Headache", "Arthritis",
  "Asthma", "Digestion", "Skin", "Liver", "Blood Pressure", "Immunity",
  "Anxiety", "Insomnia", "Malaria", "Infection", "Inflammation", "Hair",
  "Weight", "Kidney", "Heart", "Cholesterol", "Acne", "Wound",
];

function toArray(category: string | string[] | undefined): string[] {
  if (!category) return [];
  if (Array.isArray(category)) return category;
  return category.split(",").map((c) => c.trim()).filter(Boolean);
}

// Normalize category names to group similar ones visually
function getCategoryEmoji(cat: string): string {
  const lower = cat.toLowerCase();
  if (lower.includes("herb")) return "🌿";
  if (lower.includes("tree")) return "🌳";
  if (lower.includes("shrub")) return "🪴";
  if (lower.includes("fruit")) return "🍊";
  if (lower.includes("climber")) return "🌱";
  if (lower.includes("fungus")) return "🍄";
  if (lower.includes("succulent")) return "🌵";
  if (lower.includes("desert")) return "🏜️";
  if (lower.includes("sacred")) return "🪷";
  if (lower.includes("toxic")) return "⚠️";
  if (lower.includes("ornamental")) return "🌸";
  if (lower.includes("angiosperm")) return "🌺";
  return "🌾";
}

export default function Garden() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlantCategory[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "plants"));
        const plantsData: Plant[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plant[];

        setPlants(plantsData);

        const allCategories = Array.from(
          new Set(plantsData.flatMap((p) => toArray(p.category)))
        );
        setCategories(allCategories);
      } catch (err) {
        console.error("Plants fetch error:", err);
      } finally {
        setLoadingPlants(false);
      }
    };

    fetchPlants();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleCategory = (cat: PlantCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return DISEASE_SUGGESTIONS.slice(0, 8);
    return DISEASE_SUGGESTIONS.filter((d) =>
      d.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
  }, [searchQuery]);

  const filteredPlants = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return plants.filter((plant) => {
      // Search across all relevant fields including diseases
      const matchesSearch =
        query === "" ||
        (plant.name ?? "").toLowerCase().includes(query) ||
        (plant.scientificName ?? "").toLowerCase().includes(query) ||
        (plant.hindiName ?? "").toLowerCase().includes(query) ||
        (plant.description ?? "").toLowerCase().includes(query) ||
        (Array.isArray(plant.medicinalUses)
          ? plant.medicinalUses.some((use) =>
              (use ?? "").toLowerCase().includes(query)
            )
          : false) ||
        (Array.isArray(plant.diseases)
          ? plant.diseases.some((d) =>
              (d ?? "").toLowerCase().includes(query)
            )
          : false) ||
        toArray(plant.category).some((c) =>
          c.toLowerCase().includes(query)
        );

      const plantCategories = toArray(plant.category);
      const matchesCategory =
        selectedCategories.length === 0 ||
        plantCategories.some((cat) => selectedCategories.includes(cat));

      const matchesBookmark = !showBookmarked || bookmarks.includes(plant.id);

      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [searchQuery, selectedCategories, showBookmarked, bookmarks, plants]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              <Leaf className="w-3.5 h-3.5" />
              Virtual Herbal Garden
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Explore the Garden
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Search by plant name, disease, or medicinal use. Filter by category to discover nature's pharmacy.
            </p>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div ref={searchRef} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by plant name, disease, or medicinal use…"
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Disease Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        Search by Disease / Condition
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 px-4 py-3">
                      {filteredSuggestions.map((d) => (
                        <button
                          key={d}
                          onClick={() => { setSearchQuery(d); setShowSuggestions(false); }}
                          className="px-3 py-1 bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground text-xs rounded-full font-medium transition-colors"
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Category Filter — Card Grid Style ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            {/* Section label */}
            <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto px-1">
              <p className="text-sm font-semibold text-foreground/70">Filter by Category</p>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Clear ({selectedCategories.length})
                </button>
              )}
            </div>

            {/* Category cards */}
            <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
              {visibleCategories.map((cat) => {
                const isActive = selectedCategories.includes(cat);
                const emoji = getCategoryEmoji(cat);
                return (
                  <motion.button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                      border transition-all duration-200 shadow-sm
                      ${isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                        : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                      }
                    `}
                  >
                    <span className="text-sm leading-none">{emoji}</span>
                    <span className="leading-snug text-left">
                      {/* Shorten very long names */}
                      {cat.length > 30 ? cat.replace(/\(.*?\)/g, "").trim() : cat}
                    </span>
                    {isActive && (
                      <span className="ml-1 w-3.5 h-3.5 rounded-full bg-white/30 flex items-center justify-center">
                        <X className="w-2 h-2" />
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {/* Bookmarked toggle */}
              <motion.button
                onClick={() => setShowBookmarked(!showBookmarked)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                  border transition-all duration-200 shadow-sm
                  ${showBookmarked
                    ? "bg-amber-500 text-white border-amber-500 shadow-amber-200"
                    : "bg-card text-foreground border-border hover:border-amber-400/50 hover:bg-amber-50/50"
                  }
                `}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Bookmarked
              </motion.button>
            </div>

            {/* Show more / less */}
            {categories.length > 10 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  {showAllCategories ? "Show Less" : `Show ${categories.length - 10} More Categories`}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </motion.div>

          {/* ── Result Count ── */}
          <AnimatePresence>
            {(selectedCategories.length > 0 || showBookmarked || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredPlants.length}</span>{" "}
                  plant{filteredPlants.length !== 1 ? "s" : ""} found
                </span>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setShowBookmarked(false);
                    setSearchQuery("");
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Plant Grid ── */}
          {loadingPlants ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
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
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No plants found
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Try a different search term, disease name, or category.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}