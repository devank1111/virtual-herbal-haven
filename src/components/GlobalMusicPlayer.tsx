import { useEffect, useRef, useState } from "react";

export default function GlobalMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || started) return;

    audio.loop = true;
    audio.volume = 0.3;

    const cleanup = () => {
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    const startMusic = async () => {
      if (!audio) return;

      try {
        await audio.play();
        setStarted(true);
        cleanup();
        console.log("Music started");
      } catch (err) {
        console.log("Autoplay blocked:", err);
      }
    };

    const handleInteraction = () => {
      startMusic();
    };

    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);

    return cleanup;
  }, [started]);

  return (
    <audio ref={audioRef} preload="auto">
      <source src="/audio/site-music.mp3" type="audio/mpeg" />
    </audio>
  );
}