import { motion } from "framer-motion";
import {
  Leaf,
  MapPin,
  AlertTriangle,
  Lightbulb,
  Pill,
  Scissors,
  Sparkles,
  Globe,
  User,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { Plant } from "@/data/plants";

interface PlantDetailSectionsProps {
  plant: Plant;
}

export default function PlantDetailSections({ plant }: PlantDetailSectionsProps) {
  const sections = [
    { icon: Leaf, title: "Description", content: plant.description },
    { icon: Globe, title: "Native Location", content: plant.nativeLocation },
    { icon: MapPin, title: "Habitat & Growing Conditions", content: plant.habitat },
    { icon: User, title: "Key Researcher", content: plant.researcher },
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

      {/* References Section */}
      {plant.references && plant.references.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: sections.length * 0.05 }}
          className="p-6 rounded-xl bg-card shadow-botanical botanical-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Research References
            </h2>
          </div>
          <ul className="space-y-4 pl-12">
            {plant.references.map((ref, j) => (
              <li key={j} className="text-muted-foreground">
                <p className="font-medium text-foreground text-sm leading-snug">
                  {ref.title}
                </p>
                <p className="text-xs mt-1">
                  {ref.authors} — <span className="italic">{ref.journal}</span> ({ref.year})
                </p>
                <a
                  href={ref.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent mt-1 font-medium transition-colors"
                >
                  View Paper <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
