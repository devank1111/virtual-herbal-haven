import { motion } from "framer-motion";
import {
  Leaf,
  MapPin,
  AlertTriangle,
  Lightbulb,
  Pill,
  Scissors,
  Sparkles,
} from "lucide-react";
import type { Plant } from "@/data/plants";

interface PlantDetailSectionsProps {
  plant: Plant;
}

export default function PlantDetailSections({ plant }: PlantDetailSectionsProps) {
  const sections = [
    { icon: Leaf, title: "Description", content: plant.description },
    { icon: MapPin, title: "Habitat & Growing Conditions", content: plant.habitat },
    { icon: Pill, title: "Medicinal Uses", content: null, list: plant.medicinalUses },
    { icon: Scissors, title: "Parts Used", content: plant.partsUsed.join(" • ") },
    { icon: Sparkles, title: "Preparation Methods", content: plant.preparation },
    { icon: AlertTriangle, title: "Precautions", content: plant.precautions },
    { icon: Lightbulb, title: "Fun Fact", content: plant.funFact },
  ];

  return (
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
  );
}
