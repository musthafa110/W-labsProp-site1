import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Heart, Sparkles, Volume2, VolumeX } from "lucide-react";
import { ambientSynth } from "../utils/audio";

const SONG_URLS = [
  "https://ceenaija.com/wp-content/uploads/2023/10/Stephen-Sanchez-Until-I-Found-You.mp3",
  "https://scarybeatz.com/wp-content/uploads/2023/10/Stephen_Sanchez_-_Until_I_Found_You.mp3",
  "https://archive.org/download/stephen-sanchez-until-i-found-you/Stephen_Sanchez_-_Until_I_Found_You.mp3",
  "https://archive.org/download/stephen-sanchez-until-i-found-you/Stephen-Sanchez-Until-I-Found-You.mp3",
  "https://starlingentertainments.com/wp-content/uploads/2023/11/Until-I-Found-You-Stephen-Sanchez.mp3"
];

interface PageSurpriseProps {
  onNext: () => void;
  onSparkle: () => void;
  onBurst: (x: number, y: number) => void;
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
}

export default function PageSurprise({ 
  onNext, 
  onSparkle, 
  onBurst,
  musicPlaying,
  setMusicPlaying
}: PageSurpriseProps) {
  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMuteSong = () => {
    setMusicPlaying(!musicPlaying);
    onSparkle();
  };

  const handleOpenGift = (e: MouseEvent<HTMLDivElement>) => {
    if (isOpened) return;
    setIsOpened(true);
    onSparkle();

    // Find the center of the gift box for particle bursts
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Trigger explosive hearts/confetti multiple times for rich visual feedback
    onBurst(x, y);
    setTimeout(() => onBurst(x, y - 50), 150);
    setTimeout(() => onBurst(x, y - 100), 300);

    // Stop ambient synthesizer so we can play the custom song
    ambientSynth.stop();

    // Enable the custom romantic YouTube track
    setMusicPlaying(true);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[70vh] relative z-10" ref={containerRef}>


      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
        className="glass-card max-w-lg w-full p-8 md:p-12 rounded-[36px] shadow-xl border border-white/50 space-y-10 relative overflow-hidden"
      >
        <div className="space-y-2 flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#2E2023] font-medium">
            A Creative Surprise
          </h2>
          <p className="text-xs text-rose-500 tracking-widest uppercase font-semibold font-sans mb-2">
            {!isOpened ? "Tap the glowing gift box to open" : "A sincere gift just for you"}
          </p>
        </div>

        {/* Gift Box Container */}
        <div className="flex justify-center items-center h-[220px] relative">
          {!isOpened ? (
            /* Unopened Interactive 3D CSS Gift Box with Glow */
            <motion.div
              onClick={handleOpenGift}
              className="relative w-36 h-36 cursor-pointer group mb-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing Backlight */}
              <div className="absolute inset-0 bg-radial-gradient from-rose-300/40 to-transparent rounded-full blur-2xl scale-150 animate-pulse" />
              
              {/* Gift Box Base */}
              <div className="absolute bottom-0 left-4 right-4 h-24 bg-gradient-to-tr from-rose-400 to-rose-300 rounded-b-2xl shadow-md border-b-2 border-rose-500/30 overflow-hidden">
                {/* Horizontal Ribbon */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-amber-200 shadow-inner -translate-y-1/2" />
                {/* Vertical Ribbon */}
                <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-amber-200 shadow-inner -translate-x-1/2" />
              </div>

              {/* Gift Box Lid */}
              <motion.div 
                className="absolute top-6 left-2 right-2 h-8 bg-rose-400 rounded-t-lg shadow border-b border-rose-500/20 z-10"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.0,
                  ease: "easeInOut"
                }}
              >
                {/* Horizontal Lid Ribbon */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-amber-200 -translate-y-1/2" />
                {/* Vertical Lid Ribbon */}
                <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-amber-200 -translate-x-1/2" />
              </motion.div>

              {/* Elegant Bow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 z-20 flex justify-center items-center">
                <div className="w-6 h-6 rounded-full bg-amber-200/90 border border-amber-300 shadow-sm absolute -left-1 transform -rotate-12 group-hover:scale-110 transition-transform" />
                <div className="w-6 h-6 rounded-full bg-amber-200/90 border border-amber-300 shadow-sm absolute -right-1 transform rotate-12 group-hover:scale-110 transition-transform" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-300 z-30" />
              </div>

              {/* Dynamic Sparkle Indicators */}
              <div className="absolute -top-3 -left-3 text-amber-300 opacity-60 animate-ping" style={{ animationDuration: "3s" }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-3 -right-3 text-amber-300 opacity-60 animate-ping" style={{ animationDuration: "2.5s" }}>
                <Sparkles className="w-5 h-5" />
              </div>

              {/* Elegant floating crystal badge directly under gift */}
              <div className="btn-liquid-crystal absolute -bottom-7 left-1/2 -translate-x-1/2 w-max inline-flex flex-col items-center px-5 py-2 rounded-[14px] shadow-sm space-y-0.5 cursor-pointer">
                <span className="text-[10px] tracking-widest uppercase font-bold font-sans flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 fill-rose-100 text-rose-400 animate-pulse" />
                  <span>Tap to Open</span>
                </span>
                <span className="text-[8px] text-[#8C6B70]/80 tracking-widest uppercase font-bold font-sans">
                  Click to Continue
                </span>
              </div>
            </motion.div>
          ) : (
            /* Opened Animated Gift State showing Floating Scroll Card */
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: -10 }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              className="relative p-8 rounded-2xl glass-card border border-rose-200 bg-white/75 max-w-sm w-full shadow-lg"
            >
              {/* Subtle Volume Indicator/Toggle inside the card */}
              <button
                onClick={toggleMuteSong}
                className="btn-liquid-crystal absolute top-4 right-4 p-2 rounded-full text-rose-500 transition-all active:scale-95 cursor-pointer z-20"
                title={musicPlaying ? "Mute Background Music" : "Play Background Music"}
              >
                {musicPlaying ? (
                  <div className="relative">
                    <Volume2 className="w-4.5 h-4.5 animate-bounce" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  </div>
                ) : (
                  <VolumeX className="w-4.5 h-4.5 text-rose-300" />
                )}
              </button>

              {/* Sparkle background details */}
              <div className="absolute top-2 left-2 text-rose-300 animate-pulse">
                <Heart className="w-4 h-4 fill-rose-100" />
              </div>
              <div className="absolute bottom-2 right-2 text-rose-300 animate-pulse">
                <Heart className="w-4 h-4 fill-rose-100" />
              </div>

              <div className="space-y-5">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                
                <p className="font-serif italic text-xl md:text-2xl text-[#3A1E22] leading-relaxed">
                  "Some people become special without even realizing it."
                </p>
                
                <p className="text-[10px] tracking-widest text-[#9A7D82] uppercase font-semibold">
                  And you are that person
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Button */}
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-2 flex flex-col items-center"
          >
            <button
              onClick={() => {
                onSparkle();
                onNext();
              }}
              className="btn-liquid-crystal-primary group px-9 py-4.5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 w-full max-w-xs mx-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <span className="text-base font-medium text-white flex items-center space-x-1">
                <span>Continue</span>
                <Sparkles className="w-4 h-4 text-rose-200" />
              </span>
              
              <span className="text-[9px] text-rose-100/80 uppercase tracking-widest font-bold pt-1 border-t border-white/20 w-full font-sans">
                Click to Continue
              </span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
