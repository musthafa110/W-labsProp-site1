import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Flower2, Sparkles, RefreshCw, CheckCircle2, MessageSquare } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ambientSynth } from "../utils/audio";

interface PageProposalProps {
  onAnswer: (answer: "yes" | "time") => void;
  onSparkle: () => void;
}

type SubmissionState = "idle" | "message" | "loading" | "success";

export default function PageProposal({ onAnswer, onSparkle }: PageProposalProps) {
  const [selectedChoice, setSelectedChoice] = useState<"yes" | "time" | null>(null);
  const [submittingState, setSubmittingState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  const handleChoiceSelect = (choice: "yes" | "time") => {
    onSparkle();
    setSelectedChoice(choice);
    // Move to optional message collection step
    setSubmittingState("message");
  };

  const handleResponseSubmit = async () => {
    if (!selectedChoice) return;
    setSubmittingState("loading");

    try {
      // Format readable date & time for admin reference
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Submit to Firebase Firestore
      await addDoc(collection(db, "responses"), {
        response: selectedChoice === "yes" ? "Yes" : "I Need More Time",
        date: dateStr,
        time: timeStr,
        timestamp: serverTimestamp(),
        message: message.trim() || ""
      });

      // Successful submission
      setSubmittingState("success");

      // Small delay to let them read the sweet success text before transitioning
      setTimeout(() => {
        onAnswer(selectedChoice);
      }, 2500);

    } catch (error) {
      console.error("Error submitting response to Firestore:", error);
      // Fallback transition so the user experience isn't broken
      onAnswer(selectedChoice);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 min-h-[70vh] relative z-10 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-xl w-full p-10 md:p-14 rounded-[36px] shadow-2xl border border-rose-100 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 240, 242, 0.6) 100%)",
          boxShadow: "0 25px 60px rgba(229, 115, 115, 0.08), inset 0 0 40px rgba(255, 255, 255, 0.6)"
        }}
      >
        <AnimatePresence mode="wait">
          {submittingState === "idle" && (
            /* CHOICE BUTTONS */
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Top glowing indicators */}
              <div className="relative inline-flex justify-center items-center mx-auto">
                <div className="absolute inset-0 bg-rose-200/40 rounded-full blur-xl scale-150 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-white/80 border border-rose-200/50 flex items-center justify-center shadow-sm">
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-300 animate-pulse" />
                </div>
              </div>

              {/* Title and message */}
              <div className="space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl text-rose-500 font-medium tracking-tight">
                  Afra...
                </h2>
                <p className="font-serif italic text-xl md:text-2xl text-[#3A1E22] leading-relaxed max-w-md mx-auto">
                  "Would you like to give me a chance to know each other better? ❤️"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6 pt-4 flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto w-full">
                  {/* YES BUTTON */}
                  <button
                    onClick={() => handleChoiceSelect("yes")}
                    className="btn-liquid-crystal-primary group px-8 py-5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    
                    <div className="flex items-center space-x-1.5 font-medium text-base text-white">
                      <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                      <span>💖 Yes</span>
                    </div>
                    
                    <span className="text-[9px] text-rose-100/80 uppercase tracking-widest font-bold pt-1 border-t border-white/20 w-full font-sans">
                      Click to Continue
                    </span>
                  </button>

                  {/* TIME BUTTON */}
                  <button
                    onClick={() => handleChoiceSelect("time")}
                    className="btn-liquid-crystal group px-8 py-5 rounded-[22px] font-serif font-semibold tracking-wide flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    
                    <div className="flex items-center space-x-1.5 font-medium text-base text-stone-700">
                      <Flower2 className="w-4 h-4 text-rose-400 group-hover:rotate-45 transition-transform duration-500" />
                      <span>🌸 More Time</span>
                    </div>
                    
                    <span className="text-[9px] text-[#8C6B70] uppercase tracking-widest font-bold pt-1 border-t border-rose-200/30 w-full font-sans">
                      Click to Continue
                    </span>
                  </button>
                </div>
              </div>

              {/* Sincere reassurance footer note */}
              <p className="text-[10px] text-[#9A7D82] uppercase tracking-widest font-semibold max-w-xs mx-auto leading-relaxed">
                There is no pressure. Whatever you choose is fully, unconditionally respected.
              </p>
            </motion.div>
          )}

          {submittingState === "message" && (
            /* OPTIONAL MESSAGE INPUT FORM */
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              className="space-y-8"
            >
              {/* Top icon */}
              <div className="relative inline-flex justify-center items-center mx-auto">
                <div className="absolute inset-0 bg-rose-200/30 rounded-full blur-xl scale-150 animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-white/90 border border-rose-200/50 flex items-center justify-center shadow-sm text-rose-400">
                  <MessageSquare className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-[#3A1E22]">
                  Add a little note? (Optional)
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  If there is anything you'd like to say or share, you can write it here. Otherwise, you can submit directly.
                </p>
              </div>

              {/* TextArea Form */}
              <div className="space-y-6">
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    ambientSynth.playTypeClick();
                  }}
                  placeholder="Your thoughts, feelings, or a sweet note..."
                  maxLength={500}
                  className="w-full h-32 bg-white/70 border border-rose-200/40 rounded-2xl p-4 text-sm text-[#3A1E22] placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200/30 transition-all font-serif italic shadow-inner resize-none"
                />

                {/* Submissions button layout */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  {/* SKIP BUTTON */}
                  <button
                    onClick={handleResponseSubmit}
                    className="btn-liquid-crystal flex-1 px-6 py-4 rounded-[18px] font-serif font-semibold text-sm cursor-pointer"
                  >
                    Skip and Submit
                  </button>

                  {/* SUBMIT BUTTON */}
                  <button
                    onClick={handleResponseSubmit}
                    className="btn-liquid-crystal-primary flex-1 group px-6 py-4 rounded-[18px] font-serif font-semibold text-sm cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    <span>Submit Response ❤️</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {submittingState === "loading" && (
            /* SUBMITTING SPINNER STATE */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 space-y-6 flex flex-col items-center justify-center"
            >
              <RefreshCw className="w-10 h-10 animate-spin text-rose-500" />
              <p className="font-serif italic text-lg text-rose-700/80 tracking-wide animate-pulse">
                Delivering your response... ✨
              </p>
            </motion.div>
          )}

          {submittingState === "success" && (
            /* SUCCESSFUL CONFIRMATION SCREEN */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 space-y-8 flex flex-col items-center justify-center"
            >
              {/* Beating heart and checkmark indicator */}
              <div className="relative inline-flex justify-center items-center">
                <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-2xl scale-150 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center shadow-lg">
                  <Heart className="w-10 h-10 text-rose-500 fill-rose-300 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white border-2 border-white shadow-md">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-500" />
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-rose-600">
                  Thank you! Your response has been received. ❤️
                </h3>
                <p className="text-xs text-[#8C6D73] font-sans">
                  Preparing your final journey path...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
