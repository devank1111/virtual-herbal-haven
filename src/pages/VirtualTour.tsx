import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf, Info, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Link } from "react-router-dom";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";

interface Plant {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  description: string;
  image: string;
  category: string[];
  medicinalUse: string[]; // Firebase mein "medicinalUse" hai
}

export default function VirtualTour() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "plants"));
        const fetchedPlants: Plant[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            category: Array.isArray(data.category)
              ? data.category
              : data.category
              ? [data.category]
              : [],
            // Firebase field name: "medicinalUse" (array)
            medicinalUse: Array.isArray(data.medicinalUse)
              ? data.medicinalUse
              : data.medicinalUse
              ? [data.medicinalUse]
              : [],
          };
        }) as Plant[];
        setPlants(fetchedPlants);
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Plants load karne mein problem aayi. Dobara try karo.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const plant = plants[currentIndex];

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % plants.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + plants.length) % plants.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Garden load ho raha hai...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-destructive space-y-2">
            <p className="text-lg font-semibold">Kuch galat ho gaya!</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Koi plant nahi mila Firebase mein.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Tour Header */}
        <div className="container mx-auto px-4 pt-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Leaf className="w-4 h-4" />
              Virtual Garden Tour
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Walk Through the Garden
            </h1>
            <p className="text-muted-foreground">
              Navigate through our medicinal plant collection one by one
            </p>
          </motion.div>
        </div>

        {/* Tour Viewer */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-botanical-lg botanical-border bg-card"
              style={{ height: "460px" }}
            >
              {/* Image — position absolute so it never changes card height */}
              <div className="relative overflow-hidden">
                <img
                  src={plant.image}
                  alt={`${plant.name} - ${plant.scientificName}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent lg:bg-gradient-to-r" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground">
                  {currentIndex + 1} / {plants.length}
                </div>
              </div>

              {/* Info */}
              <div className="p-8 lg:p-10 flex flex-col justify-center overflow-y-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {plant.category?.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <h2 className="font-display text-3xl font-bold text-foreground mb-1">
                  {plant.name}
                </h2>
                <p className="text-sm italic text-muted-foreground mb-4">
                  {plant.scientificName} • {plant.hindiName}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                  {plant.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
                    Key Uses
                  </h3>
                  <ul className="space-y-1.5">
                    {/* Firebase "medicinalUse" — sirf pehle 3 */}
                    {plant.medicinalUse?.slice(0, 3).map((use, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/plant/${plant.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-herb-glow transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Full Details
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goPrev}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card botanical-border shadow-botanical text-foreground font-medium hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                {plants.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-primary w-6"
                        : "bg-border hover:bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to plant ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card botanical-border shadow-botanical text-foreground font-medium hover:bg-muted transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}