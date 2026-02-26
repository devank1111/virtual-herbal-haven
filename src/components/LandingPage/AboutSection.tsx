import { motion } from "framer-motion";
import { BookOpen, Globe, Heart, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Ancient Knowledge",
    description: "Access detailed information about medicinal plants documented in AYUSH systems for thousands of years.",
  },
  {
    icon: Shield,
    title: "Verified Information",
    description: "Every plant profile includes scientifically validated properties alongside traditional usage methods.",
  },
  {
    icon: Globe,
    title: "Accessible Anywhere",
    description: "No physical garden needed — explore, learn, and bookmark your favorite herbs from anywhere.",
  },
  {
    icon: Heart,
    title: "Holistic Healing",
    description: "Covering Ayurveda, Yoga, Unani, Siddha, and Homeopathy — the complete AYUSH spectrum.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              About AYUSH Garden
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
              Bridging Traditional Wisdom with Modern Technology
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The AYUSH sector encompasses five traditional Indian systems of medicine —
              Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy. These systems
              rely heavily on medicinal plants that have been used for healing for millennia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our Virtual Herbal Garden makes this knowledge accessible to everyone,
              offering an immersive digital experience to explore, learn, and appreciate
              the incredible diversity of India's medicinal plant heritage.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-background shadow-botanical botanical-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
