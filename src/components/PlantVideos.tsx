import { motion } from "framer-motion";
import { Play } from "lucide-react";

const plantVideos: Record<string, { title: string; videoId: string }[]> = {
  tulsi: [
    { title: "Health Benefits of Tulsi", videoId: "QvmPxK9pNa0" },
    { title: "How to Grow Tulsi at Home", videoId: "J2KWCXNBUOQ" },
  ],
  ashwagandha: [
    { title: "Ashwagandha Benefits Explained", videoId: "LK0JEfMJpbk" },
    { title: "How Ashwagandha Works", videoId: "GNqJis3Ojcc" },
  ],
  turmeric: [
    { title: "Turmeric: The Golden Spice", videoId: "GJbOBr3JWBI" },
    { title: "How to Use Turmeric Daily", videoId: "1JlL-CmYBXQ" },
  ],
  neem: [
    { title: "Neem: The Village Pharmacy", videoId: "Ww_R-HxEbvI" },
    { title: "Benefits of Neem Leaves", videoId: "S9K-zfqzspI" },
  ],
  "aloe-vera": [
    { title: "Aloe Vera Uses & Benefits", videoId: "bIQP-tEO-jE" },
    { title: "Growing Aloe Vera at Home", videoId: "rJ5_MdrStCU" },
  ],
  brahmi: [
    { title: "Brahmi for Brain Health", videoId: "5K60vEMrOR8" },
    { title: "How to Use Brahmi", videoId: "UuvE5Tz0_Z0" },
  ],
  amla: [
    { title: "Amla: Indian Gooseberry Benefits", videoId: "qlB_0-6O-OE" },
    { title: "Amla Juice Recipe & Uses", videoId: "2IHT3WN3aGc" },
  ],
  shatavari: [
    { title: "Shatavari Benefits for Women", videoId: "kRXVoN-enxE" },
    { title: "How to Take Shatavari", videoId: "6x2GjBHx8JQ" },
  ],
  giloy: [
    { title: "Giloy: The Root of Immortality", videoId: "K46-KFrhm-4" },
    { title: "How to Use Giloy", videoId: "Z-2gwNvuWDU" },
  ],
  lavender: [
    { title: "Lavender Health Benefits", videoId: "6bVPPszHMYQ" },
    { title: "Growing Lavender", videoId: "OhyY2IpxjWA" },
  ],
  peppermint: [
    { title: "Peppermint Oil Benefits", videoId: "2UZxgwk5sFg" },
    { title: "How to Grow Peppermint", videoId: "Cqd6V3fL4VU" },
  ],
  moringa: [
    { title: "Moringa: The Miracle Tree", videoId: "g2-MrCfFkRE" },
    { title: "How to Use Moringa Leaves", videoId: "7oVpNIjb2eo" },
  ],
  hibiscus: [
    { title: "Hibiscus Tea Benefits", videoId: "bpqKmSIo5e8" },
    { title: "Growing Hibiscus Plants", videoId: "xQ0sKdrJfVM" },
  ],
  cinnamon: [
    { title: "Cinnamon Health Benefits", videoId: "sMwJX7o73g0" },
    { title: "True Cinnamon vs Cassia", videoId: "d4fUCiNxjKg" },
  ],
  sandalwood: [
    { title: "Sandalwood Benefits for Skin", videoId: "Y0fKagjFrAE" },
    { title: "The Story of Sandalwood", videoId: "6LJOO7n2NLw" },
  ],
};

interface PlantVideosProps {
  plantId: string;
  plantName: string;
}

export default function PlantVideos({ plantId, plantName }: PlantVideosProps) {
  const videos = plantVideos[plantId] ?? [
    { title: `Learn about ${plantName}`, videoId: "dQw4w9WgXcQ" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Play className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">Related Videos</h3>
      </div>

      {videos.map((video, i) => (
        <motion.div
          key={video.videoId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}
          className="rounded-xl overflow-hidden bg-card shadow-botanical botanical-border"
        >
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-foreground">{video.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
