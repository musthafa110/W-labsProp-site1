import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Heart, Sparkles } from "lucide-react";
import TypingText from "./TypingText";

interface PageStoryProps {
  onNext: () => void;
  onSparkle: () => void;
}

export default function PageStory({ onNext, onSparkle }: PageStoryProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(0);

  const sentences = [
    "Sometimes...",
    "Life introduces us to someone unexpectedly.",
    "And before we realize it...",
    "They become someone we'd like to know better."
  ];

  const handleNextSentence = () => {
    onSparkle();
    if (currentStep < sentences.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxTilt = 3.5; // Gentle tilt
    const tiltX = -(y / (rect.height / 2)) * maxTilt;
    const tiltY = (x / (rect.width / 2)) * maxTilt;
    
    const maxShadowShift = 10;
    const sX = (x / (rect.width / 2)) * maxShadowShift;
    const sY = (y / (rect.height / 2)) * maxShadowShift;
    
    setRotateX(tiltX);
    setRotateY(tiltY);
    setShadowX(sX);
    setShadowY(sY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShadowX(0);
    setShadowY(0);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[70vh] relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card max-w-xl w-full p-8 md:p-12 rounded-[36px] shadow-lg border border-white/50 space-y-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 248, 248, 0.45) 100%)",
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${shadowX}px ${8 + shadowY}px 32px rgba(229, 115, 115, 0.06), inset 0 0 24px rgba(255, 255, 255, 0.5)`,
          transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
        }}
      >
        {/* Soft elegant glowing ring background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Story progress dots */}
        <div className="flex justify-center space-x-2 pb-2">
          {sentences.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep 
                  ? "w-8 bg-rose-400" 
                  : i < currentStep 
                    ? "w-2 bg-rose-300/60" 
                    : "w-2 bg-stone-200/80"
              }`}
            />
          ))}
        </div>

        {/* Central Story Box */}
        <div className="min-h-[160px] flex flex-col justify-center items-center px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-4"
            >
              <Heart className="w-6 h-6 text-rose-300/50 fill-rose-300/20 mx-auto animate-pulse" />
              <p className="font-serif italic text-2xl md:text-3xl text-[#3A2226] leading-relaxed font-medium">
                <TypingText
                  text={sentences[currentStep]}
                  speed={48}
                  delay={80}
                  className="font-serif italic"
                />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Buttons */}
        <div className="pt-2 flex flex-col items-center">
          {currentStep < sentences.length - 1 ? (
            <button
              onClick={handleNextSentence}
              className="btn-liquid-crystal group px-8 py-4 rounded-[20px] tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <div className="flex items-center space-x-1.5 font-serif font-medium text-base text-[#2C1D20]">
                <span>Read on ✨</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-rose-400" />
              </div>
              
              <span className="text-[9px] text-[#8C6B70]/80 uppercase tracking-widest font-bold pt-1 border-t border-rose-200/30 w-full font-sans">
                Click to Continue
              </span>
            </button>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              onClick={onNext}
              className="btn-liquid-crystal-primary group px-9 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <div className="flex items-center space-x-1.5 font-medium text-base text-white">
                <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                <span>Continue ❤️</span>
              </div>
              
              <span className="text-[9px] text-rose-100/80 uppercase tracking-widest font-bold pt-1 border-t border-white/20 w-full font-sans">
                Click to Continue
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
