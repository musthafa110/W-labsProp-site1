import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Heart, Sparkles, Check } from "lucide-react";

interface PageLetterProps {
  onNext: () => void;
  onSparkle: () => void;
}

export default function PageLetter({ onNext, onSparkle }: PageLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [envRotateX, setEnvRotateX] = useState(0);
  const [envRotateY, setEnvRotateY] = useState(0);
  const [envShadowX, setEnvShadowX] = useState(0);
  const [envShadowY, setEnvShadowY] = useState(0);

  const [letRotateX, setLetRotateX] = useState(0);
  const [letRotateY, setLetRotateY] = useState(0);
  const [letShadowX, setLetShadowX] = useState(0);
  const [letShadowY, setLetShadowY] = useState(0);

  const handleOpenLetter = () => {
    onSparkle();
    setIsOpen(true);
  };

  const handleEnvMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 4;
    const tiltY = (x / (rect.width / 2)) * 4;
    const sX = (x / (rect.width / 2)) * 12;
    const sY = (y / (rect.height / 2)) * 12;
    setEnvRotateX(tiltX);
    setEnvRotateY(tiltY);
    setEnvShadowX(sX);
    setEnvShadowY(sY);
  };

  const handleEnvMouseLeave = () => {
    setEnvRotateX(0);
    setEnvRotateY(0);
    setEnvShadowX(0);
    setEnvShadowY(0);
  };

  const handleLetMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 3;
    const tiltY = (x / (rect.width / 2)) * 3;
    const sX = (x / (rect.width / 2)) * 10;
    const sY = (y / (rect.height / 2)) * 10;
    setLetRotateX(tiltX);
    setLetRotateY(tiltY);
    setLetShadowX(sX);
    setLetShadowY(sY);
  };

  const handleLetMouseLeave = () => {
    setLetRotateX(0);
    setLetRotateY(0);
    setLetShadowX(0);
    setLetShadowY(0);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[70vh] relative z-10">
      {!isOpen ? (
        /* Sealed Luxury Envelope Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={handleOpenLetter}
          onMouseMove={handleEnvMouseMove}
          onMouseLeave={handleEnvMouseLeave}
          className="glass-card max-w-md w-full p-10 rounded-[32px] shadow-lg border border-rose-200/50 cursor-pointer text-center space-y-8 transition-all duration-500 hover:scale-[1.03] group"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 240, 242, 0.55) 100%)",
            transform: `perspective(1000px) rotateX(${envRotateX}deg) rotateY(${envRotateY}deg)`,
            boxShadow: `${envShadowX}px ${12 + envShadowY}px 32px rgba(229, 115, 115, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.6)`,
            transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
          }}
        >
          {/* Pulsing seal */}
          <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-100/70 border border-rose-200/40 flex items-center justify-center text-rose-400 group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <div className="absolute inset-0 bg-rose-300/10 rounded-full scale-125 animate-ping opacity-60" style={{ animationDuration: "2s" }} />
            <Mail className="w-10 h-10 group-hover:scale-110 transition-transform text-rose-400/90" />
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <h3 className="font-serif italic text-2xl text-rose-800/80 font-medium">
              For Zahra
            </h3>
            
            {/* Beautiful crystal sub-badge */}
            <div className="btn-liquid-crystal inline-flex flex-col items-center space-y-1.5 px-6 py-3 rounded-[20px] shadow-md mt-2 max-w-xs cursor-pointer">
              <div className="flex items-center space-x-1.5 text-rose-600 font-sans font-bold text-[11px] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 fill-rose-200 text-rose-400 animate-pulse" />
                <span>Tap to Open</span>
              </div>
              <span className="text-[9px] text-[#8C6B70]/80 uppercase tracking-widest font-bold pt-1 border-t border-rose-200/30 w-full text-center font-sans">
                Click to Continue
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-rose-200/30 w-2/3 mx-auto" />

          <p className="text-xs text-[#8A7175] leading-relaxed italic max-w-xs mx-auto">
            "A message of absolute sincerity, written from the heart."
          </p>
        </motion.div>
      ) : (
        /* Beautiful unfolded elegant Stationery letter */
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleLetMouseMove}
          onMouseLeave={handleLetMouseLeave}
          className="glass-card max-w-xl w-full p-8 md:p-14 rounded-[36px] shadow-2xl border border-rose-100 text-left relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 249, 245, 0.8) 100%)",
            transform: `perspective(1000px) rotateX(${letRotateX}deg) rotateY(${letRotateY}deg)`,
            boxShadow: `${letShadowX}px ${25 + letShadowY}px 60px rgba(229, 115, 115, 0.08), inset 0 0 40px rgba(255, 255, 255, 0.8)`,
            transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
          }}
        >
          {/* Subtle watermarks in background */}
          <div className="absolute top-10 right-10 opacity-5 pointer-events-none text-rose-500">
            <Heart className="w-40 h-40 fill-rose-500" />
          </div>

          {/* Letter Body */}
          <div className="space-y-6 text-[#4F393C] font-serif text-lg leading-relaxed relative z-10">
            <p className="font-serif italic font-semibold text-rose-600/90 border-b border-rose-200/40 pb-3 text-2xl">
              Dear Zahra,
            </p>

            <p className="text-base md:text-lg">
              I don't know what the future holds, but I wanted to be honest with you.
            </p>

            <p className="text-base md:text-lg">
              This little website is my way of expressing something sincere.
            </p>

            <p className="text-base md:text-lg">
              I don't expect anything from you except honesty.
            </p>

            <p className="text-base md:text-lg">
              Whatever your answer is, I'll respect it completely.
            </p>

            <p className="text-base md:text-lg">
              I simply wanted you to know that I'd genuinely like the chance to know you better.
            </p>

            <p className="text-base md:text-lg">
              Zahra, if you're willing to wait for me while I settle in life—it may take around two years—I promise that when I'm ready, I'll come to you, and I will marry you if our families give us their blessing to build our life together. I'm asking for your patience because I'm serious about this and want to build a future with you. Whatever your answer may be, I'll always respect your decision. ❤️
            </p>

            <p className="text-base md:text-lg">
              Thank you for reading this.
            </p>

            <div className="pt-8 border-t border-rose-200/30 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-sans tracking-widest text-[#9A7D82] uppercase font-semibold">With respect,</p>
                <p className="font-cursive text-3xl text-rose-500 tracking-wider">Zain</p>
              </div>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-300 animate-pulse" />
            </div>
          </div>

          {/* Unfold Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center flex flex-col items-center"
          >
            <button
              onClick={() => {
                onSparkle();
                onNext();
              }}
              className="btn-liquid-crystal-primary group px-9 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <div className="flex items-center space-x-1.5 font-medium text-base text-white">
                <span>One More Thing... ✨</span>
              </div>
              
              <span className="text-[9px] text-rose-100/80 uppercase tracking-widest font-bold pt-1 border-t border-white/20 w-full font-sans">
                Click to Continue
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
