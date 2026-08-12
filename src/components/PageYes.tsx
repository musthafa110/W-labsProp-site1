import { motion } from "motion/react";
import { Heart, Sparkles, RefreshCw } from "lucide-react";

interface PageYesProps {
  onRestart: () => void;
}

export default function PageYes({ onRestart }: PageYesProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[75vh] relative z-10 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 80 }}
        className="glass-card max-w-xl w-full p-10 md:p-14 rounded-[36px] shadow-2xl border border-rose-200/50 text-center space-y-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 243, 245, 0.8) 0%, rgba(255, 224, 229, 0.75) 100%)",
          boxShadow: "0 30px 70px rgba(244,63,94,0.15), inset 0 0 50px rgba(255,255,255,0.9)"
        }}
      >
        {/* Dynamic festive visual indicator */}
        <div className="relative inline-flex justify-center items-center">
          {/* Multiple rotating halos */}
          <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-2xl scale-150 animate-pulse" />
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
            className="absolute inset-[-10px] border border-dashed border-rose-300/60 rounded-full scale-110"
          />
          <div className="relative w-24 h-24 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center shadow-md">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-300 animate-[bounce_1.2s_infinite]" />
          </div>
        </div>

        {/* Celebratory message */}
        <div className="space-y-6">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-rose-600 font-bold tracking-tight"
          >
            Thank you for giving us a chance. ❤️
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 font-serif text-lg md:text-xl text-[#3A1E22] leading-relaxed max-w-md mx-auto italic font-medium"
          >
            <p>
              "I promise to always respect you and your feelings."
            </p>
            <p className="text-rose-500 font-semibold not-italic text-xl">
              This is the beginning of a beautiful journey. ❤️
            </p>
          </motion.div>
        </div>

        {/* Sincere subtext */}
        <p className="text-xs text-[#8C6D73] font-sans max-w-sm mx-auto leading-relaxed">
          May our paths bring endless warmth, deep conversations, and laughter. Sincerity will always guide us forward.
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
            
            <div className="flex items-center space-x-1.5 font-medium text-base text-rose-600">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
              <span>Replay Journey</span>
            </div>
            
            <span className="text-[9px] text-[#8C6B70] uppercase tracking-widest font-bold pt-1 border-t border-rose-200/30 w-full font-sans">
              Click to Continue
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
