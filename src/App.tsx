import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  RefreshCw, 
  Sparkles,
  Award,
  Instagram
} from "lucide-react";

// Import custom pages & canvas
import { HeartsCanvas, HeartsCanvasRef } from "./components/HeartsCanvas";
import { ambientSynth } from "./utils/audio";
import PageLoading from "./components/PageLoading";
import PageWelcome from "./components/PageWelcome";
import PageStory from "./components/PageStory";
import PageLetter from "./components/PageLetter";
import PageSurprise from "./components/PageSurprise";
import PageSky from "./components/PageSky";
import PageProposal from "./components/PageProposal";
import PageYes from "./components/PageYes";
import PageTime from "./components/PageTime";
import AdminPanel from "./components/AdminPanel";
import YouTubeAudioPlayer from "./components/YouTubeAudioPlayer";

type AppStage = 
  | "loading"
  | "welcome"
  | "story"
  | "letter"
  | "surprise"
  | "sky"
  | "proposal"
  | "yes"
  | "time";

export default function App() {
  const canvasRef = useRef<HeartsCanvasRef>(null);

  // Admin Mode state (never auto-open on initial load)
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Clear #admin hash on initial load if present so admin panel never opens automatically
    if (window.location.hash === "#admin") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const handleHashChange = () => {
      setIsAdminMode(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // States
  const [stage, setStage] = useState<AppStage>("loading");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [visitedStages, setVisitedStages] = useState<AppStage[]>(["welcome"]);

  // Set the gradient background depending on current step for perfect romantic mood matching
  const bgClasses: Record<AppStage, string> = {
    loading: "from-[#FFFBF9] via-[#FFF5F6] to-[#FFEBEF]",
    welcome: "from-[#FDFBF7] via-[#FFF3F5] to-[#FFF0F2]",
    story: "from-[#FFF5F6] via-[#FFEBEF] to-[#FFE0E4]",
    letter: "from-[#FFF9F6] via-[#FFF5F6] to-[#FFF0F2]",
    surprise: "from-[#FFF5F6] via-[#FFE5E9] to-[#FFE0E4]",
    sky: "from-[#0F172A] via-[#1E293B] to-[#111827]", // Night Sky dark theme!
    proposal: "from-[#FFF5F6] via-[#FFEAEF] to-[#FFE5EC]",
    yes: "from-[#FFE5E9] via-[#FFD3D9] to-[#FFC5CE]", // Vibrant romantic pink fireworks glow
    time: "from-[#FFF9F6] via-[#FDF3F3] to-[#FCECEC]"  // Calming pastel peach respect
  };

  // Helper to handle navigation & record history for breadcrumbs/navigation bar
  const goToStage = (nextStage: AppStage) => {
    setStage(nextStage);
    if (!visitedStages.includes(nextStage)) {
      setVisitedStages([...visitedStages, nextStage]);
    }
    if (nextStage === "letter") {
      canvasRef.current?.rainHearts();
    }
    // Auto scroll to top of viewport on transition
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle music playback for the requested YouTube track
  const handleToggleMusic = () => {
    setMusicPlaying(prev => !prev);
  };

  // Visual heart effect on stage navigation
  const triggerSparkleSoundAndEffect = (x?: number, y?: number) => {
    if (canvasRef.current) {
      canvasRef.current.burstHearts(x, y);
    }
  };

  // Play extra chime when "yes" is clicked
  const handleYesChimeAndFireworks = (answer: "yes" | "time") => {
    if (answer === "yes") {
      ambientSynth.playYesChime();
      goToStage("yes");
      // Continuous firework bursts on canvas
      if (canvasRef.current) {
        canvasRef.current.burstConfetti(window.innerWidth / 2, window.innerHeight / 3);
        setTimeout(() => canvasRef.current?.burstHearts(window.innerWidth / 4, window.innerHeight / 2), 300);
        setTimeout(() => canvasRef.current?.burstConfetti(3 * window.innerWidth / 4, window.innerHeight / 2), 600);
      }
    } else {
      goToStage("time");
    }
  };

  const resetJourney = () => {
    setStage("welcome");
    setVisitedStages(["welcome"]);
    ambientSynth.stop();
    setMusicPlaying(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if current stage is dark (Memory Sky)
  const isDarkTheme = stage === "sky";

  if (isAdminMode) {
    return <AdminPanel />;
  }

  return (
    <div
      className={`min-h-screen bg-radial-gradient ${bgClasses[stage]} ${
        isDarkTheme ? "text-slate-100" : "text-[#3D2C2F]"
      } font-sans transition-all duration-[2000ms] ease-in-out relative overflow-x-hidden no-scrollbar selection:bg-rose-200 selection:text-rose-900 pb-12 flex flex-col justify-between`}
    >
      {/* Absolute Ambient Particle Canvas overlay */}
      <HeartsCanvas ref={canvasRef} />

      {/* Centralised YouTube Audio Player playing the user's requested song */}
      <YouTubeAudioPlayer videoId="U8jcQDLxJwo" startTime={31} isPlaying={musicPlaying} />

      {/* Floating Sparkle details */}
      {!isDarkTheme && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* HEADER CONTROLS */}
      {stage !== "loading" && (
        <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-30">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => {
              if (stage === "letter") {
                canvasRef.current?.rainHearts();
              } else {
                canvasRef.current?.burstHearts();
              }
            }}
            title={stage === "letter" ? "Click for Heart Rain 💕" : "Click for Hearts 💕"}
          >
            <Heart className={`w-5 h-5 ${isDarkTheme ? "text-rose-300" : "text-rose-400"} fill-rose-300 animate-pulse group-hover:scale-125 transition-transform duration-300`} />
            <span className={`font-serif tracking-widest text-[10px] uppercase font-bold ${isDarkTheme ? "text-rose-200/70" : "text-rose-500/80"}`}>
              Sincerity &amp; Respect
            </span>
          </motion.div>

          {/* Right Header: Music Control & Restart */}
          <div className="flex items-center space-x-3">
            {/* Music Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleMusic}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer relative ${
                isDarkTheme 
                  ? "btn-liquid-crystal-dark" 
                  : "btn-liquid-crystal"
              }`}
              title={musicPlaying ? "Mute Background Music" : "Play Ambient Music"}
            >
              {musicPlaying ? (
                <>
                  <div className="absolute inset-0 rounded-full border border-rose-400 scale-125 animate-ping opacity-25" />
                  <Volume2 className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <VolumeX className="w-4 h-4 opacity-70" />
              )}
            </motion.button>

            {/* Restart Button */}
            {stage !== "welcome" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetJourney}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isDarkTheme 
                    ? "btn-liquid-crystal-dark" 
                    : "btn-liquid-crystal"
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Restart</span>
              </motion.button>
            )}
          </div>
        </header>
      )}

      {/* CENTRAL SCENE MANAGER WITH TRANSITIONS */}
      <div className="flex-grow flex items-center justify-center py-6 w-full relative z-20">
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <PageLoading onComplete={() => goToStage("welcome")} />
            </motion.div>
          )}

          {stage === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full"
            >
              <PageWelcome 
                onNext={() => goToStage("story")} 
                onSparkle={triggerSparkleSoundAndEffect} 
              />
            </motion.div>
          )}

          {stage === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <PageStory 
                onNext={() => goToStage("letter")} 
                onSparkle={triggerSparkleSoundAndEffect} 
              />
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="w-full"
            >
              <PageLetter 
                onNext={() => goToStage("surprise")} 
                onSparkle={triggerSparkleSoundAndEffect} 
              />
            </motion.div>
          )}

          {stage === "surprise" && (
            <motion.div
              key="surprise"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <PageSurprise 
                onNext={() => goToStage("sky")} 
                onSparkle={triggerSparkleSoundAndEffect} 
                onBurst={(x, y) => {
                  canvasRef.current?.burstConfetti(x, y);
                  canvasRef.current?.burstHearts(x, y);
                }}
                musicPlaying={musicPlaying}
                setMusicPlaying={setMusicPlaying}
              />
            </motion.div>
          )}

          {stage === "sky" && (
            <motion.div
              key="sky"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="w-full"
            >
              <PageSky 
                onNext={() => goToStage("proposal")} 
                onSparkle={triggerSparkleSoundAndEffect} 
              />
            </motion.div>
          )}

          {stage === "proposal" && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <PageProposal 
                onAnswer={handleYesChimeAndFireworks} 
                onSparkle={triggerSparkleSoundAndEffect} 
              />
            </motion.div>
          )}

          {stage === "yes" && (
            <motion.div
              key="yes"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="w-full"
            >
              <PageYes onRestart={resetJourney} />
            </motion.div>
          )}

          {stage === "time" && (
            <motion.div
              key="time"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="w-full"
            >
              <PageTime onRestart={resetJourney} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      {stage !== "loading" && (
        <footer className="w-full max-w-4xl mx-auto px-4 mt-8 text-center space-y-3 relative z-30">
          <div className="flex justify-center items-center space-x-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span className={`font-cursive text-2xl tracking-wide ${isDarkTheme ? "text-rose-200" : "text-rose-500"}`}>
              Zahra
            </span>
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
          </div>
          
          <p className={`text-[10px] tracking-widest uppercase font-semibold font-sans ${isDarkTheme ? "text-slate-400/70" : "text-[#9E858A]"}`}>
            "Made with sincerity and respect, just for Zahra."
          </p>

          <div className="pt-2 flex justify-center items-center">
            <a 
              href="https://www.instagram.com/wish_labs.in?igsh=MXNvOTBrOWphamFrbQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-sans font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                isDarkTheme 
                  ? "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-rose-300 hover:border-rose-400/50" 
                  : "bg-white/80 border-rose-200/60 text-[#7A5B60] hover:text-rose-600 hover:bg-white hover:border-rose-300"
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              <span>Created by <span className="font-semibold underline underline-offset-2">Wish Labs</span></span>
            </a>
          </div>
        </footer>
      )}

      {/* Simple Secret Admin Access Heart Emoji in Bottom Left Corner */}
      {stage !== "loading" && (
        <button
          onClick={() => {
            triggerSparkleSoundAndEffect();
            setIsAdminMode(true);
            window.location.hash = "#admin";
          }}
          className="fixed bottom-3 left-3 z-50 p-1 cursor-pointer text-sm leading-none opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-200 select-none"
          title="Access Admin Panel"
          aria-label="Admin Panel"
        >
          ❤️
        </button>
      )}
    </div>
  );
}
