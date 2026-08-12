import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Sparkles, Heart, HelpCircle } from "lucide-react";

interface PageSkyProps {
  onNext: () => void;
  onSparkle: () => void;
}

interface StarItem {
  id: string;
  word: string;
  description: string;
  x: string; // % coordinate for responsive canvas
  y: string; // % coordinate for responsive canvas
  color: string;
}

export default function PageSky({ onNext, onSparkle }: PageSkyProps) {
  const [visited, setVisited] = useState<string[]>([]);
  const [selectedStar, setSelectedStar] = useState<StarItem | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const stars: StarItem[] = [
    {
      id: "respect",
      word: "Respect",
      description: "I admire your values, your intelligence, and the beautiful, elegant way you carry yourself in life.",
      x: "15%",
      y: "25%",
      color: "from-amber-200 to-amber-100",
    },
    {
      id: "kindness",
      word: "Kindness",
      description: "The genuine warmth and soft grace you bring to this world deserve all the happiness life can offer.",
      x: "45%",
      y: "15%",
      color: "from-rose-300 to-rose-100",
    },
    {
      id: "sincerity",
      word: "Sincerity",
      description: "This entire gesture is simple and honest. My words carry nothing but pure, unvarnished truth.",
      x: "80%",
      y: "25%",
      color: "from-pink-300 to-pink-100",
    },
    {
      id: "hope",
      word: "Hope",
      description: "A simple, gentle wish that we could begin a beautiful story, sharing thoughts and walking step-by-step.",
      x: "25%",
      y: "65%",
      color: "from-indigo-200 to-indigo-100",
    },
    {
      id: "happiness",
      word: "Happiness",
      description: "No matter what, your comfort is my priority. My ultimate goal is to bring a warm, bright smile to your day.",
      x: "70%",
      y: "60%",
      color: "from-amber-300 to-amber-200",
    },
  ];

  const handleStarClick = (star: StarItem) => {
    onSparkle();
    setSelectedStar(star);
    
    let updatedVisited = visited;
    if (!visited.includes(star.id)) {
      updatedVisited = [...visited, star.id];
      setVisited(updatedVisited);
    }
    
    const isLastStar = updatedVisited.length === stars.length;

    setTimeout(() => {
      if (isLastStar) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        boardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 150);
  };

  const allVisited = visited.length === stars.length;

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[75vh] relative z-10 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
        className="glass-card max-w-2xl w-full p-8 md:p-12 rounded-[36px] shadow-2xl border border-white/40 space-y-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.45) 0%, rgba(30, 41, 59, 0.4) 100%)",
          backdropFilter: "blur(24px)",
          color: "#FFFBFB"
        }}
      >
        {/* Sky Header */}
        <div className="space-y-2 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-1.5 text-amber-300/80">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "15s" }} />
            <span className="text-xs uppercase tracking-widest font-semibold font-sans">Memory Sky</span>
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "15s" }} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">
            Touch the Glowing Stars
          </h2>
          <p className="text-xs text-rose-200/60 max-w-sm mx-auto leading-relaxed mb-1">
            Five celestial values are hidden in the night sky. Tap each star to illuminate a heartfelt thought.
          </p>
          
          {!selectedStar && (
            <div className="inline-flex flex-col items-center px-5 py-1.5 bg-white/10 border border-white/20 rounded-[14px] text-amber-200 font-sans tracking-widest uppercase font-bold shadow-sm backdrop-blur-sm animate-[pulse_2s_infinite] space-y-0.5">
              <span className="text-[10px] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Touch any star above</span>
              </span>
              <span className="text-[8px] text-white/50 tracking-widest uppercase font-bold font-sans">
                Click to Continue
              </span>
            </div>
          )}
        </div>

        {/* Interactive Sky Constellation Canvas */}
        <div className="h-[260px] md:h-[300px] w-full rounded-2xl relative bg-black/30 border border-white/10 overflow-hidden shadow-inner">
          {/* Subtle starry background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.1)_0%,transparent_70%)]" />
          
          {/* Stars Drawing */}
          {stars.map((star) => {
            const isVisited = visited.includes(star.id);
            const isSelected = selectedStar?.id === star.id;
            
            return (
              <motion.button
                key={star.id}
                onClick={() => handleStarClick(star)}
                style={{ left: star.x, top: star.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none flex flex-col items-center group cursor-pointer z-20"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Glowing halo */}
                <div 
                  className={`absolute inset-0 rounded-full blur-md transition-all duration-700 ${
                    isSelected 
                      ? "bg-amber-300/60 scale-175" 
                      : isVisited 
                        ? "bg-rose-300/40 scale-150" 
                        : "bg-white/10 scale-110 group-hover:bg-white/30"
                  }`} 
                  style={{ width: "24px", height: "24px" }}
                />

                {/* Star Icon */}
                <Star 
                  className={`w-6 h-6 transition-all duration-500 relative z-10 ${
                    isSelected 
                      ? "text-amber-300 fill-amber-200 scale-110 animate-pulse" 
                      : isVisited 
                        ? "text-rose-200 fill-rose-100" 
                        : "text-white/40 hover:text-white/80"
                  }`} 
                />

                {/* Star Word Label */}
                <span className={`text-[10px] tracking-widest uppercase font-semibold font-sans mt-2.5 transition-colors duration-500 ${
                  isSelected 
                    ? "text-amber-200 font-bold" 
                    : isVisited 
                      ? "text-rose-200" 
                      : "text-white/30 group-hover:text-white/60"
                }`}>
                  {star.word}
                </span>
              </motion.button>
            );
          })}

          {/* Constellation Lines (drawn between stars sequentially for premium design) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="15%" y1="25%" x2="45%" y2="15%" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="45%" y1="15%" x2="80%" y2="25%" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="25%" x2="70%" y2="60%" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="70%" y1="60%" x2="25%" y2="65%" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="25%" y1="65%" x2="15%" y2="25%" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Dynamic Display Board for selected star */}
        <div ref={boardRef} className="min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedStar ? (
              <motion.div
                key={selectedStar.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-5 rounded-2xl bg-white/10 border border-white/10 text-center space-y-2.5 max-w-md w-full relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${selectedStar.color}`} />
                <h4 className="font-serif text-xl text-white font-medium flex items-center justify-center space-x-1.5">
                  <Star className="w-4 h-4 fill-current text-amber-200" />
                  <span>{selectedStar.word}</span>
                </h4>
                <p className="text-sm text-rose-100/90 leading-relaxed font-serif italic">
                  "{selectedStar.description}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-xs italic text-rose-200/50 flex flex-col items-center space-y-2"
              >
                <HelpCircle className="w-5 h-5 opacity-40 animate-bounce" />
                <span>Illuminated thoughts will appear here...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button revealed only after tapping stars */}
        <div ref={bottomRef} className="pt-2 flex flex-col items-center">
          {allVisited ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={onNext}
              className="btn-liquid-crystal-primary group px-9 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <div className="flex items-center space-x-1.5 font-medium text-base text-white">
                <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                <span>Almost There ❤️</span>
              </div>
              
              <span className="text-[9px] text-rose-100/80 uppercase tracking-widest font-bold pt-1 border-t border-white/20 w-full font-sans">
                Click to Continue
              </span>
            </motion.button>
          ) : (
            <div className="text-xs text-rose-200/40 tracking-wider">
              Explore all {stars.length} stars to unlock the final path ({visited.length}/{stars.length})
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
