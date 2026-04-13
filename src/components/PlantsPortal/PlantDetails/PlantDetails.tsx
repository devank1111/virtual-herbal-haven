import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";
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
  Utensils,
  Volume2,
  VolumeX,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPE — Firebase ke actual field names ke according
// ─────────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  answerType: 'single' | 'multiple';
  options: string[];
  correctAnswers: number[];
  points: number;
  negativePoints: number;
  isBonus: boolean;
}


export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  hindiName?: string;
  about?: string;             // Firebase: "about"
  image: string;
  youtubeEmbedUrl?: string; 
  category: string;           // Firebase: single string e.g. "Medicinal desert shrub"
  medicinalUse?: string[];    // Firebase: "medicinalUse" array
  conditions?: string[];
  ayushSystem?: string[];
  nativeLocation?: string;
  habitat?: string;
  keyResearcher?: string;     // Firebase: "keyResearcher"
  precautions?: string;
  preparation?: string;       // Firebase: "preparation"
  researchPapers?: string[];  // Firebase: array of URL strings
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  quizQuestions?: QuizQuestion[];
}

// ─────────────────────────────────────────────────────────────
// NORMALIZER
// ─────────────────────────────────────────────────────────────
function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === "string");
  if (typeof val === "string" && val.trim()) return val.split(",").map((s) => s.trim());
  return [];
}

function normalizeQuizQuestions(val: unknown): QuizQuestion[] {
  if (!Array.isArray(val)) return [];

  return val.map((q: any) => ({
    question: typeof q?.question === "string" ? q.question : "",
    answerType: q?.answerType === "multiple" ? "multiple" : "single",
    options: Array.isArray(q?.options) ? q.options.filter((opt: unknown) => typeof opt === "string") : [],
    correctAnswers: Array.isArray(q?.correctAnswers)
      ? q.correctAnswers.filter((i: unknown) => typeof i === "number")
      : [],
    points: typeof q?.points === "number" ? q.points : 0,
    negativePoints: typeof q?.negativePoints === "number" ? q.negativePoints : 0,
    isBonus: Boolean(q?.isBonus),
  }));
  
}


function normalizePlant(id: string, data: Record<string, unknown>): Plant {
  return {
    id,
    name:           (data.name as string) ?? "",
    scientificName: (data.scientificName as string) ?? "",
    hindiName:      (data.hindiName as string) ?? undefined,
    about:          (data.about as string) ?? undefined,
    image:          (data.image as string) ?? "",
    youtubeEmbedUrl: (data.youtubeEmbedUrl as string) ?? undefined,
    category:       typeof data.category === "string" ? data.category : "",
    medicinalUse:   toStringArray(data.medicinalUse),
    conditions:     toStringArray(data.conditions),
    ayushSystem:    toStringArray(data.ayushSystem),
    nativeLocation: (data.nativeLocation as string) ?? undefined,
    habitat:        (data.habitat as string) ?? undefined,
    keyResearcher:  (data.keyResearcher as string) ?? undefined,
    precautions:    (data.precautions as string) ?? undefined,
    preparation:    (data.preparation as string) ?? undefined,
    researchPapers: toStringArray(data.researchPapers),
    city:           (data.city as string) ?? undefined,
    state:          (data.state as string) ?? undefined,
    lat:            (data.lat as number) ?? undefined,
    lng:            (data.lng as number) ?? undefined,
    quizQuestions: normalizeQuizQuestions(data.quizQuestions),
  };
}



// ─────────────────────────────────────────────────────────────
// FIREBASE FETCH HOOK
// ─────────────────────────────────────────────────────────────
function usePlantById(id: string | undefined) {
  const [plant, setPlant]     = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    async function fetchPlant() {
      try {
        setLoading(true);
        setError(null);
        const docRef  = doc(db, "plants", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlant(normalizePlant(docSnap.id, docSnap.data() as Record<string, unknown>));
        } else {
          setPlant(null);
        }
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Failed to load plant data.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlant();
  }, [id]);

  return { plant, loading, error };
}

// ─────────────────────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f2]">
      <Header />
      <div className="relative h-[52vh] min-h-[380px] bg-gray-200 animate-pulse" />
      <div className="max-w-5xl mx-auto w-full px-6 pt-6 space-y-4 pb-14">
        <div className="h-12 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        <div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        <div className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        <div className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
function PlantDetailHero({
  plant,
  isBookmarked,
  onBookmark,
  onShare,
  isSpeaking,
  onToggleSpeech,
}: {
  plant: Plant;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}) {
  // category is a plain string in Firebase — split by comma for multiple badges
  const categories = plant.category
    ? plant.category.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

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
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-200 backdrop-blur-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Plant name row with speaker button */}
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-[2.6rem] sm:text-5xl font-bold text-white leading-none tracking-tight">
            {plant.name}
          </h1>
          <button
            onClick={onToggleSpeech}
            aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
            title={isSpeaking ? "Stop reading" : "Read plant details aloud"}
            className={`flex-shrink-0 w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 ${
              isSpeaking
                ? "bg-green-500/30 border-green-400/50 hover:bg-green-500/40"
                : "bg-black/25 border-white/15 hover:bg-black/40"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-green-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/90" />
            )}
          </button>
        </div>

        <p className="text-[15px] italic text-white/55 font-light">
          {plant.scientificName}
          {plant.hindiName && (
            <span className="not-italic text-white/40"> · {plant.hindiName}</span>
          )}
          {(plant.city || plant.state) && (
            <span className="not-italic text-white/35">
              {" "}· {[plant.city, plant.state].filter(Boolean).join(", ")}
            </span>
          )}
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
  variant?: "green" | "rose" | "amber" | "neutral";
}) {
  const cls = {
    green:   "bg-green-50  text-green-800  border-green-100",
    rose:    "bg-rose-50   text-rose-700   border-rose-100",
    amber:   "bg-amber-50  text-amber-700  border-amber-100",
    neutral: "bg-gray-50   text-gray-700   border-gray-200",
  }[variant];
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[13px] font-medium border ${cls}`}>
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
  accent?: "sky" | "green" | "violet" | "rose" | "amber";
}) {
  if (!value) return null;
  const accentCls = {
    sky:    "bg-sky-50    text-sky-600",
    green:  "bg-green-50  text-green-700",
    violet: "bg-violet-50 text-violet-600",
    rose:   "bg-rose-50   text-rose-500",
    amber:  "bg-amber-50  text-amber-600",
  }[accent];
  return (
    <div className="flex items-start gap-3.5 py-4 border-b border-gray-100 last:border-0">
      <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${accentCls}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[14.5px] text-gray-700 leading-relaxed whitespace-pre-line">{value}</p>
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
      {plant.about && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">About</p>
          <p className="text-gray-700 leading-[1.8] text-[15px]">{plant.about}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plant.medicinalUse && plant.medicinalUse.length > 0 && (
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
              {plant.medicinalUse.map((use) => (
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
              {plant.conditions.map((c) => (
                <Chip key={c} label={c} variant="rose" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2">
        <InfoRow icon={Globe}         label="Native Location" value={plant.nativeLocation} accent="sky"    />
        <InfoRow icon={MapPin}        label="Habitat"         value={plant.habitat}         accent="green"  />
        <InfoRow icon={User}          label="Key Researcher"  value={plant.keyResearcher}   accent="violet" />
        <InfoRow icon={AlertTriangle} label="Precautions"     value={plant.precautions}     accent="rose"   />
        <InfoRow icon={Utensils}      label="Preparation"     value={plant.preparation}     accent="amber"  />
      </div>

      {plant.ayushSystem && plant.ayushSystem.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            AYUSH Systems
          </p>
          <div className="flex flex-wrap gap-2">
            {plant.ayushSystem.map((s) => (
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

// 🔽 YEH YAHA PASTE KARNA HAI (ModelTab ke upar)
const extractEmbedUrl = (value?: string) => {
  if (!value) return "";

  // agar direct embed URL hai
  if (value.includes("youtube.com/embed/")) {
    const srcMatch = value.match(/src="([^"]+)"/);
    return srcMatch?.[1] || value;
  }

  // agar iframe HTML hai
  const iframeSrcMatch = value.match(/src="([^"]+)"/);
  if (iframeSrcMatch?.[1]) {
    return iframeSrcMatch[1];
  }

  return value;
};

// ─────────────────────────────────────────────────────────────
// 3D MODEL TAB
// ─────────────────────────────────────────────────────────────
function ModelTab({ plant }: { plant: Plant }) {
  const videoUrl = extractEmbedUrl(plant.youtubeEmbedUrl);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-base">
            🎥
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-800">
              Plant Video — {plant.name}
            </h2>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Embedded YouTube video
            </p>
          </div>
        </div>

        {videoUrl ? (
          <div className="w-full aspect-video bg-black">
            <iframe
              src={videoUrl}
              title={`${plant.name} video`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-[480px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
            <div className="text-center space-y-2 opacity-40">
              <div className="text-5xl">🎥</div>
              <p className="text-gray-500 text-sm font-medium">
                Video not available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESEARCH TAB — researchPapers is array of URL strings
// ─────────────────────────────────────────────────────────────
function ResearchTab({ plant }: { plant: Plant }) {
  const papers = plant.researchPapers ?? [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-800">Research &amp; References</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">Scientific studies for {plant.name}</p>
        </div>
      </div>

      {papers.length > 0 ? (
        <div className="space-y-3">
          {papers.map((url, idx) => {
            let domain = url;
            try { domain = new URL(url).hostname.replace("www.", ""); } catch {}
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-center hover:border-green-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-[12px] mb-0.5 uppercase tracking-wide font-semibold">
                    {domain}
                  </p>
                  <p className="text-gray-600 text-[13px] truncate">{url}</p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 text-green-600 hover:text-green-800 text-[13px] font-semibold transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-gray-600 font-semibold text-[15px]">No references available yet</p>
          <p className="text-gray-400 text-sm mt-1">We're expanding our database — check back soon.</p>
        </div>
      )}
    </div>
  );
}

function QuizTab({ plant }: { plant: Plant }) {
  const questions = plant.quizQuestions ?? [];
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSingleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: [optIndex],
    }));
  };

  const handleMultipleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;

    setAnswers((prev) => {
      const current = prev[qIndex] || [];
      const exists = current.includes(optIndex);

      return {
        ...prev,
        [qIndex]: exists
          ? current.filter((i) => i !== optIndex)
          : [...current, optIndex],
      };
    });
  };

  const isCorrectAnswer = (userAns: number[], correctAns: number[]) => {
    if (userAns.length !== correctAns.length) return false;
    const sortedUser = [...userAns].sort();
    const sortedCorrect = [...correctAns].sort();
    return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
  };

  const report = questions.map((q, qIndex) => {
    const userAns = answers[qIndex] || [];
    const isCorrect = isCorrectAnswer(userAns, q.correctAnswers);

    const earned = userAns.length === 0
      ? 0
      : isCorrect
      ? q.points
      : q.negativePoints;

    return {
      question: q.question,
      isCorrect,
      earned,
      isBonus: q.isBonus,
      correctAnswers: q.correctAnswers,
      userAnswers: userAns,
      points: q.points,
      negativePoints: q.negativePoints,
    };
  });

  const totalScore = report.reduce((sum, item) => sum + item.earned, 0);
  const correctCount = report.filter((r) => r.isCorrect).length;
  const wrongCount = report.filter((r) => r.userAnswers.length > 0 && !r.isCorrect).length;
  const skippedCount = report.filter((r) => r.userAnswers.length === 0).length;
  const bonusCount = report.filter((r) => r.isBonus).length;

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <p className="text-4xl mb-3">🎯</p>
        <p className="text-gray-600 font-semibold text-[15px]">No quiz available yet</p>
        <p className="text-gray-400 text-sm mt-1">Quiz questions will appear here for this plant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!submitted && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[18px] font-bold text-gray-800">Quiz on {plant.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit karke apna score aur report card dekho.
          </p>
        </div>
      )}

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Question {qIndex + 1}
              </p>
              <h3 className="text-[16px] font-semibold text-gray-800">{q.question}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                +{q.points}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                {q.negativePoints}
              </span>
              {q.isBonus && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  Bonus
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {q.options.map((option, optIndex) => {
              const selected = (answers[qIndex] || []).includes(optIndex);
              const correct = q.correctAnswers.includes(optIndex);

              let optionClass =
                "border-gray-200 hover:border-green-300";

              if (submitted) {
                if (correct) optionClass = "border-green-400 bg-green-50";
                else if (selected && !correct) optionClass = "border-red-400 bg-red-50";
              } else if (selected) {
                optionClass = "border-green-400 bg-green-50";
              }

              return (
                <label
                  key={optIndex}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${optionClass}`}
                >
                  {q.answerType === "single" ? (
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={selected}
                      disabled={submitted}
                      onChange={() => handleSingleSelect(qIndex, optIndex)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={submitted}
                      onChange={() => handleMultipleSelect(qIndex, optIndex)}
                    />
                  )}
                  <span className="text-[14.5px] text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-[oklch(35%_0.05_150)] text-white py-4 rounded-2xl font-bold hover:bg-[oklch(25%_0.05_150)] transition-all shadow-xl shadow-[oklch(35%_0.05_150/0.15)]"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-[18px] font-bold text-gray-800 mb-4">Report Card</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="rounded-xl border border-gray-100 p-4 bg-gray-50">
                <p className="text-xs text-gray-500">Total Score</p>
                <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 bg-green-50">
                <p className="text-xs text-gray-500">Correct</p>
                <p className="text-2xl font-bold text-green-700">{correctCount}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 bg-red-50">
                <p className="text-xs text-gray-500">Wrong</p>
                <p className="text-2xl font-bold text-red-700">{wrongCount}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 bg-yellow-50">
                <p className="text-xs text-gray-500">Skipped</p>
                <p className="text-2xl font-bold text-yellow-700">{skippedCount}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 bg-amber-50">
                <p className="text-xs text-gray-500">Bonus Qs</p>
                <p className="text-2xl font-bold text-amber-700">{bonusCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-[16px] font-bold text-gray-800 mb-4">Question-wise Result</h3>

            <div className="space-y-3">
              {report.map((r, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 ${
                    r.isCorrect
                      ? "border-green-200 bg-green-50"
                      : r.userAnswers.length === 0
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Q{idx + 1}. {r.question}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {r.userAnswers.length === 0
                          ? "Skipped"
                          : r.isCorrect
                          ? "Correct"
                          : "Wrong"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {r.earned > 0 ? `+${r.earned}` : r.earned}
                      </p>
                      {r.isBonus && (
                        <p className="text-xs text-amber-700 font-semibold">Bonus</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="mt-5 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium"
            >
              Retry Quiz
            </button>
          </div>
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
  { id: "model",    label: "How to Grow in Your Garden", icon: "👁"  },
  { id: "research", label: "Research Papers", icon: "🧪" },
  { id: "quiz",     label: "Quiz",     icon: "🎯" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────
export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const { plant, loading, error } = usePlantById(id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // ── TTS STATE — parent me manage, hero ko props se pass ──
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Jab plant change ho ya component unmount ho, speech band karo
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [id]);

  // Hindi female voice dhundho — voices async load hoti hain
  // ── HINDI FEMALE VOICE — known Google/Microsoft female voice names target karo ──
  const getHindiFemaleVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    // Priority 1: Google Hindi (Chrome) — Google ki hi-IN voice usually female hoti hai
    const googleHindi = voices.find(
      (v) => v.lang === "hi-IN" && /google/i.test(v.name)
    );
    if (googleHindi) return googleHindi;
    // Priority 2: Microsoft Swara / Kalpana (Windows Hindi female voices)
    const msHindiFemale = voices.find(
      (v) => v.lang === "hi-IN" && /swara|kalpana/i.test(v.name)
    );
    if (msHindiFemale) return msHindiFemale;
    // Priority 3: hi-IN me koi bhi jo "male" na ho
    const hindiNotMale = voices.find(
      (v) => v.lang === "hi-IN" && !/male/i.test(v.name)
    );
    if (hindiNotMale) return hindiNotMale;
    // Priority 4: koi bhi hi-IN
    const anyHindi = voices.find((v) => v.lang.startsWith("hi"));
    if (anyHindi) return anyHindi;
    // Last fallback: koi bhi female voice
    return voices.find((v) => /female|woman|girl|swara|kalpana/i.test(v.name)) ?? null;
  };

  // Speech end hone par state reset karo
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    if (!plant) return;

    // ── HINDI me puri details build karo — har section ka title announce karo ──
    const parts: string[] = [];

    // परिचय — topic announce karo
    parts.push(`नमस्ते! आज हम बात करेंगे औषधीय पौधे ${plant.name} के बारे में।`);

    if (plant.hindiName) {
      parts.push(`इस पौधे का हिंदी नाम है: ${plant.hindiName}.`);
    }

    parts.push(`इसका वैज्ञानिक नाम है: ${plant.scientificName}.`);

    // पौधे के बारे में — section title
    if (plant.about) {
      parts.push(`पौधे के बारे में जानकारी। ${plant.about}`);
    }

    // औषधीय उपयोग — section title bolo
    if (plant.medicinalUse && plant.medicinalUse.length > 0) {
      parts.push(
        `औषधीय उपयोग। इस पौधे का उपयोग ${plant.medicinalUse.join(", ")} में किया जाता है।`
      );
    }

    // किन बीमारियों में फायदेमंद — section title bolo
    if (plant.conditions && plant.conditions.length > 0) {
      parts.push(
        `यह पौधा किन बीमारियों में फायदेमंद है। ${plant.conditions.join(", ")}.`
      );
    }

    // तैयारी का तरीका — section title bolo
    if (plant.preparation) {
      parts.push(`तैयारी का तरीका। ${plant.preparation}`);
    }

    // सावधानियाँ — section title bolo
    if (plant.precautions) {
      parts.push(`ज़रूरी सावधानियाँ। ${plant.precautions}`);
    }

    // मूल स्थान
    if (plant.nativeLocation) {
      parts.push(`यह पौधा मूल रूप से ${plant.nativeLocation} में पाया जाता है।`);
    }

    // प्राकृतिक वास
    if (plant.habitat) {
      parts.push(`इसका प्राकृतिक वास। ${plant.habitat}.`);
    }

    // आयुष प्रणाली
    if (plant.ayushSystem && plant.ayushSystem.length > 0) {
      parts.push(
        `आयुष प्रणाली। यह पौधा ${plant.ayushSystem.join(", ")} में उपयोग होता है।`
      );
    }

    parts.push(`यह थी ${plant.name} की पूरी जानकारी। धन्यवाद!`);

    const textToRead = parts.join(" ");

    const utterance   = new SpeechSynthesisUtterance(textToRead);
    utterance.lang    = "hi-IN";
    utterance.rate    = 0.88;  // thoda slow — clearly samajh aaye
    utterance.pitch   = 1.2;  // female pitch — thoda upar
    utterance.volume  = 1;

    // Voices ready hone ke baad voice assign karo
    const assignVoiceAndSpeak = () => {
      const voice = getHindiFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    };

    // Voices already loaded hain?
    if (window.speechSynthesis.getVoices().length > 0) {
      assignVoiceAndSpeak();
    } else {
      // Voices abhi load nahi hui — event wait karo (mostly first load par)
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        assignVoiceAndSpeak();
      };
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f4f7f2]">
        <span className="text-5xl">⚠️</span>
        <p className="text-xl font-semibold text-gray-500">{error}</p>
        <Link to="/garden" className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Garden
        </Link>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f4f7f2]">
        <span className="text-5xl">🌾</span>
        <p className="text-xl font-semibold text-gray-500">Plant not found</p>
        <Link to="/garden" className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm">
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
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
      />

      {/* ── TAB BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-6 mb-5">
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${
                activeTab === tab.id ? "text-green-800" : "text-gray-400 hover:text-gray-600"
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
            {activeTab === "quiz"     && <QuizTab      plant={plant} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}