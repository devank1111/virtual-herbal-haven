import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf, Info } from "lucide-react";
import { plants } from "@/data/plants";
import { Link } from "react-router-dom";
import Header from "@/components/NavFoot/Header";
import Footer from "@/components/NavFoot/Footer";

export default function VirtualTour() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const plant = plants[currentIndex];

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % plants.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + plants.length) % plants.length);

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

        {/* Tour viewer */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-botanical-lg botanical-border bg-card"
            >
              {/* Image */}
              <div className="relative aspect-square lg:aspect-auto overflow-hidden">
                <img
                  src={plant.image}
                  alt={`${plant.name} - ${plant.scientificName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent lg:bg-gradient-to-r" />

                {/* Counter */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground">
                  {currentIndex + 1} / {plants.length}
                </div>
              </div>

              {/* Info */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {plant.category.map((cat) => (
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

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {plant.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
                    Key Uses
                  </h3>
                  <ul className="space-y-1.5">
                    {plant.medicinalUses.slice(0, 3).map((use, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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

              {/* Dots */}
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
