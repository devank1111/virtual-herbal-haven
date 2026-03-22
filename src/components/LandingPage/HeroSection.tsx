import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Search } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-garden.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Lush AYUSH herbal garden with medicinal plants"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-24 pt-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <Leaf className="w-4 h-4 text-herb-light" />
              <span className="text-sm font-medium text-herb-light">
                AYUSH Nature Herbal Garden
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ color: "hsl(42 50% 96%)" }}
          >
            Discover the{" "}
            <span style={{ color: "hsl(145 35% 72%)" }}>
              Ancient Wisdom
            </span>{" "}
            of Medicinal Plants
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg leading-relaxed mb-8 max-w-xl"
            style={{ color: "hsl(42 30% 82%)" }}
          >
            Explore an immersive digital garden featuring traditional AYUSH medicinal herbs.
            Learn about their healing properties, preparation methods, and centuries-old wisdom
            — all from the comfort of your screen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/garden"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-herb-glow transition-colors shadow-botanical-lg"
            >
              Explore Garden
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tour"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-colors backdrop-blur-sm"
              style={{
                backgroundColor: "hsl(42 50% 96% / 0.15)",
                color: "hsl(42 50% 96%)",
                border: "1px solid hsl(42 50% 96% / 0.25)",
              }}
            >
              <Search className="w-5 h-5" />
              Virtual Tour
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 mt-12 pt-8"
            style={{ borderTop: "1px solid hsl(42 50% 96% / 0.15)" }}
          >
            {[
              { label: "Medicinal Plants", value: "10+" },
              { label: "AYUSH Systems", value: "5" },
              { label: "Healing Properties", value: "60+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold" style={{ color: "hsl(145 35% 72%)" }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: "hsl(42 30% 72%)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
