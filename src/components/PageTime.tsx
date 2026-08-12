import { motion } from "motion/react";
import { Flower2, RefreshCw, Heart, Sparkles } from "lucide-react";

interface PageTimeProps {
  onRestart: () => void;
}

export default function PageTime({ onRestart }: PageTimeProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[75vh] relative z-10 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 80 }}
        className="glass-card max-w-xl w-full p-10 md:p-14 rounded-[36px] shadow-2xl border border-rose-100 text-center space-y-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 250, 246, 0.75) 100%)",
          boxShadow: "0 25px 60px rgba(110,89,92,0.06), inset 0 0 50px rgba(255,255,255,0.8)"
        }}
      >
        {/* Soft, serene visual indicator */}
        <div className="relative inline-flex justify-center items-center">
          <div className="absolute inset-0 bg-rose-200/20 rounded-full blur-xl scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-white border border-rose-100 flex items-center justify-center shadow-sm">
            <Flower2 className="w-10 h-10 text-rose-400 animate-spin" style={{ animationDuration: "15s" }} />
          </div>
        </div>

        {/* Respectful message */}
        <div className="space-y-6">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-[#3A1E22] font-semibold tracking-tight"
          >
            Thank you for being honest. 🌸
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 font-serif text-lg md:text-xl text-[#5C4549] leading-relaxed max-w-md mx-auto italic font-medium"
          >
            <p>
              "Take all the time you need."
            </p>
            <p>
              "Your comfort and happiness matter more than a quick answer."
            </p>
            <p className="text-rose-500 font-semibold not-italic text-lg">
              No matter what you decide, I'll respect your choice. 🌸
            </p>
          </motion.div>
        </div>

        {/* Reassurance footer */}
        <p className="text-xs text-[#9A7D82] font-sans max-w-xs mx-auto leading-relaxed">
          Sincerity cannot be rushed. Thank you for giving my words a place in your thoughts today.
        </p>

        {/* Restart Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="pt-4 flex flex-col items-center"
        >
          <button
            onClick={onRestart}
            className="btn-liquid-crystal group px-8 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <div className="flex items-center space-x-1.5 font-medium text-base text-stone-600">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
              <span>Replay Journey</span>
            </div>
            
            <span className="text-[9px] text-stone-500/80 uppercase tracking-widest font-bold pt-1 border-t border-stone-200/30 w-full font-sans">
              Click to Continue
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
