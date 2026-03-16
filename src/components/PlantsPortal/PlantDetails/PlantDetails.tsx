import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { plants } from "@/data/plants";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
import PlantVideos from "@/components/PlantsPortal/PlantDetails/PlantVideos";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  AlertTriangle,
  Globe,
  User,
  ExternalLink,
  FlaskConical,
  Leaf,
  HeartPulse,
  BookOpen,
} from "lucide-react";
import type { Plant } from "@/data/plants";

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
function PlantDetailHero({
  plant,
  isBookmarked,
  onBookmark,
  onShare,
}: {
  plant: Plant;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: () => void;
}) {
  return (
    <div className="relative h-[52vh] min-h-[380px] overflow-hidden">
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.82) saturate(1.05)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f0f]/95 via-[#0f1f0f]/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f0f]/30 to-transparent" />

      {/* top bar */}
      <div className="absolute top-5 left-0 right-0 max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/garden"
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 text-white/90 text-sm font-medium hover:bg-black/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Garden
        </Link>
        <div className="flex gap-2">
          <button
            onClick={onBookmark}
            aria-label="Bookmark"
            className="w-9 h-9 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/40 transition-all"
          >
            <Bookmark
              className={`w-4 h-4 transition-all ${
                isBookmarked ? "fill-amber-300 text-amber-300" : "text-white/90"
              }`}
            />
          </button>
          <button
            onClick={onShare}
            aria-label="Share"
            className="w-9 h-9 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/40 transition-all"
          >
            <Share2 className="w-4 h-4 text-white/90" />
          </button>
        </div>
      </div>

      {/* bottom text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-8"
      >
        <div className="flex flex-wrap gap-1.5 mb-3">
          {plant.category.map((cat: string) => (
            <span
              key={cat}
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-200 backdrop-blur-sm"
            >
              {cat}
            </span>
          ))}
        </div>
        <h1 className="text-[2.6rem] sm:text-5xl font-bold text-white leading-none tracking-tight mb-1.5">
          {plant.name}
        </h1>
        <p className="text-[15px] italic text-white/55 font-light">
          {plant.scientificName}
          {plant.hindiName ? (
            <span className="not-italic text-white/40"> · {plant.hindiName}</span>
          ) : null}
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SMALL REUSABLES
// ─────────────────────────────────────────────────────────────
function Chip({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "green" | "rose" | "neutral";
}) {
  const cls = {
    green:   "bg-green-50  text-green-800  border-green-100",
    rose:    "bg-rose-50   text-rose-700   border-rose-100",
    neutral: "bg-gray-50   text-gray-700   border-gray-200",
  }[variant];
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[13px] font-medium border ${cls}`}
    >
      {label}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  accent = "green",
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  accent?: "sky" | "green" | "violet" | "rose";
}) {
  if (!value) return null;
  const accentCls = {
    sky:    "bg-sky-50    text-sky-600",
    green:  "bg-green-50  text-green-700",
    violet: "bg-violet-50 text-violet-600",
    rose:   "bg-rose-50   text-rose-500",
  }[accent];
  return (
    <div className="flex items-start gap-3.5 py-4 border-b border-gray-100 last:border-0">
      <div
        className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${accentCls}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-[14.5px] text-gray-700 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ─────────────────────────────────────────────────────────────
function OverviewTab({ plant }: { plant: Plant }) {
  return (
    <div className="space-y-4">
      {/* About */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          About
        </p>
        <p className="text-gray-700 leading-[1.8] text-[15px]">{plant.description}</p>
      </div>

      {/* Medicinal uses + Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plant.medicinalUses && plant.medicinalUses.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Medicinal Uses
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {plant.medicinalUses.map((use: string) => (
                <Chip key={use} label={use} variant="green" />
              ))}
            </div>
          </div>
        )}

        {plant.conditions && plant.conditions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Helpful For
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {plant.conditions.map((c: string) => (
                <Chip key={c} label={c} variant="rose" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details rows */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2">
        <InfoRow icon={Globe}         label="Native Location" value={plant.nativeLocation} accent="sky"    />
        <InfoRow icon={MapPin}        label="Habitat"         value={plant.habitat}         accent="green"  />
        <InfoRow icon={User}          label="Key Researcher"  value={plant.researcher}      accent="violet" />
        <InfoRow icon={AlertTriangle} label="Precautions"     value={plant.precautions}     accent="rose"   />
      </div>

      {/* AYUSH systems */}
      {plant.ayushSystem && plant.ayushSystem.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            AYUSH Systems
          </p>
          <div className="flex flex-wrap gap-2">
            {plant.ayushSystem.map((s: string) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-[13px] font-semibold bg-green-100 text-green-800 border border-green-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3D MODEL TAB
// ─────────────────────────────────────────────────────────────
function ModelTab({ plant }: { plant: Plant }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-base">
            👁
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-800">
              3D Model — {plant.name}
            </h2>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Rotate and explore interactively
            </p>
          </div>
        </div>
        <div className="w-full h-[480px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center space-y-2 opacity-40">
            <div className="text-5xl">🌿</div>
            <p className="text-gray-500 text-sm font-medium">3D Model renders here</p>
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Related Videos
        </p>
        <PlantVideos plant={plant} />
      </div> */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESEARCH TAB
// ─────────────────────────────────────────────────────────────
function ResearchTab({ plant }: { plant: Plant }) {
  const hasRefs = plant.references && plant.references.length > 0;

  return (
    <div className="space-y-4">
      {/* header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-800">
            Research &amp; References
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Scientific studies for {plant.name}
          </p>
        </div>
      </div>

      {hasRefs ? (
        <div className="space-y-3">
          {plant.references.map(
            (
              ref: {
                title: string;
                authors?: string;
                journal?: string;
                year?: number;
                url?: string;
                link?: string;
              },
              idx: number
            ) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-green-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-[14.5px] leading-snug">
                    {ref.title}
                  </p>
                  {ref.authors && (
                    <p className="text-gray-500 text-[13px] mt-1">{ref.authors}</p>
                  )}
                  {(ref.journal || ref.year) && (
                    <p className="text-gray-400 text-[13px] italic mt-0.5">
                      {ref.journal}
                      {ref.journal && ref.year ? ", " : ""}
                      {ref.year}
                    </p>
                  )}
                  {(ref.url || ref.link) && (
                    <a
                      href={ref.url ?? ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 text-[13px] mt-2 font-semibold transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Paper
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-gray-600 font-semibold text-[15px]">
            No references available yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            We're expanding our database — check back soon.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: "🌿" },
  { id: "model",    label: "3D Model", icon: "👁"  },
  { id: "research", label: "Research", icon: "🧪" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────
export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const plant = plants.find((p) => p.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f4f7f2]">
        <span className="text-5xl">🌾</span>
        <p className="text-xl font-semibold text-gray-500">Plant not found</p>
        <Link
          to="/garden"
          className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Garden
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${plant.name} – AYUSH Virtual Garden`,
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

      {/* ── TAB BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-6 mb-5">
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-green-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl bg-green-50 border border-green-200"
                  transition={{ type: "spring", stiffness: 440, damping: 38 }}
                />
              )}
              <span className="relative z-10 text-sm">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "overview" && <OverviewTab  plant={plant} />}
            {activeTab === "model"    && <ModelTab     plant={plant} />}
            {activeTab === "research" && <ResearchTab  plant={plant} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}