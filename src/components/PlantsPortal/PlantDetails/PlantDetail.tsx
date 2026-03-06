import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { plants } from "@/data/plants";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
import PlantDetailHero from "@/components/PlantsPortal/unusedFile/PlantDetailHero";
import PlantDetailSections from "@/components/PlantsPortal/unusedFile/PlantDetailSections";
import PlantVideos from "@/components/PlantsPortal/PlantDetails/PlantVideos";

const TABS = [
  { id: "overview", label: "Overview", icon: "🌿" },
  { id: "model", label: "3D Model", icon: "👁" },
  { id: "research", label: "Research", icon: "🧪" },
];

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const plant = plants.find((p) => p.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [activeTab, setActiveTab] = useState("overview");

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f7f9f5]">
        <p className="text-2xl font-semibold text-gray-600">Plant Not Found</p>
        <Link to="/garden" className="text-green-700 hover:underline">
          ← Back to Garden
        </Link>
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
    <div className="min-h-screen flex flex-col bg-[#f4f7f2]">
      <Header />

      <PlantDetailHero
        plant={plant}
        isBookmarked={isBookmarked(plant.id)}
        onBookmark={() => toggleBookmark(plant.id)}
        onShare={handleShare}
      />

      {/* AYUSH Badge Row */}
      <div className="max-w-5xl mx-auto w-full px-6 py-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 font-medium mr-1">Used in:</span>
        {plant.ayushSystem.map((system: string) => (
          <span
            key={system}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 tracking-wide"
          >
            {system}
          </span>
        ))}
      </div>

      {/* ── TAB BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-6 mb-6">
        <div className="flex rounded-2xl bg-white shadow-sm border border-gray-100 p-1.5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-green-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-green-50 border border-green-200"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10 text-base">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="space-y-5">

                {/* About Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">🌿</span>
                    About this Plant
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-[15px]">
                    {plant.description}
                  </p>
                </div>

                {/* Two-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plant.medicinalUses && plant.medicinalUses.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-base">🧊</span>
                        Medicinal Uses
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {plant.medicinalUses.map((use: string) => (
                          <span
                            key={use}
                            className="px-3 py-1.5 rounded-full text-sm bg-green-50 text-green-800 border border-green-100 font-medium"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {plant.conditions && plant.conditions.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-base">💊</span>
                        Helpful For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {plant.conditions.map((c: string) => (
                          <span
                            key={c}
                            className="px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-700 border border-gray-200 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Remaining detail sections */}
                <PlantDetailSections plant={plant} />
              </div>
            )}

            {/* ── 3D MODEL TAB ── */}
            {activeTab === "model" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <span className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">👁</span>
                      3D Model — {plant.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Rotate and explore the 3D model interactively
                    </p>
                  </div>
                  {/* 3D model placeholder — replace with your component */}
                  <div className="w-full h-[500px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">3D Model renders here</p>
                  </div>
                </div>

                {/* Videos in model tab */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-700 mb-4">Related Videos</h3>
                  <PlantVideos plant={plant} />
                </div>
              </div>
            )}

            {/* ── RESEARCH TAB ── */}
            {activeTab === "research" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-1">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">🧪</span>
                    Research & References
                  </h2>
                  <p className="text-sm text-gray-400">
                    Scientific studies and references for {plant.name}
                  </p>
                </div>

                {plant.references && plant.references.length > 0 ? (
                  <div className="space-y-3">
                    {plant.references.map(
                      (
                        ref: {
                          title: string;
                          authors?: string;
                          journal?: string;
                          year?: number;
                          url?: string;
                        },
                        index: number
                      ) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition-shadow"
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold text-[15px] leading-snug">
                              {ref.title}
                            </p>
                            {ref.authors && (
                              <p className="text-gray-500 text-sm mt-1">{ref.authors}</p>
                            )}
                            {(ref.journal || ref.year) && (
                              <p className="text-gray-400 text-sm italic mt-0.5">
                                {ref.journal}{ref.journal && ref.year ? ", " : ""}{ref.year}
                              </p>
                            )}
                            {ref.url && (
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm mt-2 font-medium transition-colors"
                              >
                                View Source →
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <p className="text-4xl mb-3">📄</p>
                    <p className="text-gray-500 font-medium">
                      No references available for this plant yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Check back later as we continue to expand our database.
                    </p>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}