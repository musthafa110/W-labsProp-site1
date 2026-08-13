import { useState, useEffect, useRef } from "react";
import { ambientSynth } from "../utils/audio";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  playSound?: boolean;
  onComplete?: () => void;
}

export default function TypingText({
  text,
  speed = 40,
  delay = 100,
  className = "",
  playSound = true,
  onComplete,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastAudioTimeRef = useRef<number>(0);

  useEffect(() => {
    setDisplayedText("");
    setIsFinished(false);

    let startTime: number | null = null;
    let lastCharCount = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const typingElapsed = elapsed - delay;
      const targetCharCount = Math.min(
        text.length,
        Math.floor(typingElapsed / Math.max(10, speed)) + 1
      );

      if (targetCharCount > lastCharCount) {
        const newChar = text[targetCharCount - 1];
        if (playSound && newChar && newChar.trim() !== "") {
          const now = performance.now();
          if (now - lastAudioTimeRef.current >= 35) {
            ambientSynth.playTypeClick();
            lastAudioTimeRef.current = now;
          }
        }

        lastCharCount = targetCharCount;
        setDisplayedText(text.slice(0, targetCharCount));
      }

      if (targetCharCount < text.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsFinished(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, speed, delay, playSound, onComplete]);

  return (
    <span className={`inline-flex items-center flex-wrap justify-center ${className}`}>
      <span>{displayedText}</span>
      <span
        className={`ml-1 inline-block w-[3px] h-[1.1em] bg-rose-400/90 rounded-full transition-opacity duration-300 ${
          isFinished ? "opacity-0" : "opacity-100 animate-pulse"
        }`}
        style={{ animationDuration: "0.8s" }}
      />
    </span>
  );
}

