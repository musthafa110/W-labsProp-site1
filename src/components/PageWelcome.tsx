import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

interface PageWelcomeProps {
  onNext: () => void;
  onSparkle: () => void;
}

export default function PageWelcome({ onNext, onSparkle }: PageWelcomeProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[70vh] relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-lg w-full p-10 md:p-14 rounded-[36px] shadow-xl border border-white/60 space-y-10 relative overflow-hidden"
        style={{
          boxShadow: "0 20px 50px rgba(229, 115, 115, 0.05), inset 0 0 30px rgba(255, 255, 255, 0.4)",
        }}
      >
        {/* Decorative corner sparkles */}
        <div className="absolute top-6 left-6 opacity-30 text-rose-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-30 text-rose-400" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {/* Ambient top logo with glowing circle */}
        <div className="relative inline-flex justify-center items-center mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-full blur-xl scale-150 opacity-45 animate-pulse" />
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            onMouseEnter={onSparkle}
            className="relative w-20 h-20 rounded-full bg-white/80 border border-rose-200/50 flex items-center justify-center shadow-md cursor-pointer transition-transform duration-300"
          >
            <Heart className="w-10 h-10 text-rose-400 fill-rose-300 animate-pulse" style={{ animationDuration: "2.5s" }} />
          </motion.div>
        </div>

        {/* Warm Premium Typography */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-serif text-5xl md:text-6xl tracking-tight text-[#2C1D20] font-medium"
          >
            Hi Afra <span className="inline-block animate-bounce" style={{ animationDuration: "3s" }}>❤️</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="font-serif italic text-lg md:text-xl text-[#6B5257] max-w-xs mx-auto"
          >
            "I made something special for you..."
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="pt-4 flex flex-col items-center w-full"
        >
          <button
            onClick={() => {
              onSparkle();
              onNext();
            }}
            className="btn-liquid-crystal group px-8 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1 w-full max-w-sm mx-auto cursor-pointer"
          >
            {/* Prismatic reflection sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-out" />
            
            <span className="text-base md:text-lg font-medium text-[#2C1D20] flex items-center space-x-1.5">
              <span>Begin the Journey</span>
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            </span>
            
            <span className="text-[9px] text-[#8C6B70]/80 uppercase tracking-widest font-sans font-bold pt-1 border-t border-rose-200/30 w-full">
              Click to Continue
            </span>
          </button>
          
          <p className="text-[10px] text-[#A68F93] tracking-widest uppercase mt-6 font-semibold font-sans">
            Sincerity, Respect &amp; Magic await
          </p>
        </motion.div>
      </motion.div>

      {/* Secret Admin Access Heart in the bottom left */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        whileHover={{ 
          opacity: 1, 
          scale: 1.15, 
          rotate: 12
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          onSparkle();
          window.location.hash = "#admin";
        }}
        className="btn-liquid-crystal fixed bottom-6 left-6 z-50 p-3 rounded-full cursor-pointer group flex items-center justify-center"
        title="Access Admin Panel"
      >
        <Heart className="w-5 h-5 text-rose-500 fill-rose-400 group-hover:fill-rose-500 transition-transform duration-300 group-hover:scale-110" />
      </motion.button>
    </div>
  );
}
