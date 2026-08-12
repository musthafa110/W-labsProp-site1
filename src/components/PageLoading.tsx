import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

interface PageLoadingProps {
  onComplete: () => void;
}

export default function PageLoading({ onComplete }: PageLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Gathering stardust...");

  const statuses = [
    "Gathering stardust...",
    "Brewing warm melodies...",
    "Polishing celestial constellations...",
    "Unfolding sincere feelings...",
    "Creating something just for Afra..."
  ];

  useEffect(() => {
    let statusIdx = 0;
    const textInterval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setStatusText(statuses[statusIdx]);
    }, 250);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + Math.floor(Math.random() * 14) + 12;
      });
    }, 40);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-radial-gradient from-[#FFF9F6] via-[#FFF3F5] to-[#FFEBEF] z-50 overflow-hidden px-4">
      {/* Decorative floating blurred soft pink spheres */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-rose-200/35 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-amber-100/30 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: "4s" }} />

      <div className="relative z-10 max-w-sm w-full text-center space-y-8">
        {/* Elegant pulsing logo */}
        <div className="relative inline-flex justify-center items-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-full bg-white/60 border border-rose-200/50 flex items-center justify-center shadow-md relative z-10"
          >
            <Heart className="w-8 h-8 text-rose-400 fill-rose-300" />
          </motion.div>
          {/* Subtle outer glowing rings */}
          <div className="absolute inset-0 border border-rose-300/30 rounded-full scale-125 animate-ping opacity-20" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-0 border border-rose-200/20 rounded-full scale-150 animate-ping opacity-10" style={{ animationDuration: "4.5s" }} />
        </div>

        {/* Loading messages */}
        <div className="space-y-3">
          <h2 className="font-serif text-2xl tracking-wide text-rose-700/80 font-medium flex items-center justify-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
            <span>Afra...</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
          </h2>
          <motion.p
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs tracking-widest text-[#8A7175] uppercase font-sans font-semibold h-4"
          >
            {statusText}
          </motion.p>
        </div>

        {/* Loading bar */}
        <div className="space-y-2">
          <div className="w-full h-[3px] bg-rose-200/30 rounded-full overflow-hidden relative border border-white/40">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <p className="text-[10px] text-rose-400 font-mono tracking-wider">
            {Math.min(Math.floor(progress), 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
