import React, { useEffect, useRef } from "react";

// Extend window interface to support YouTube Iframe Player API
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface YouTubeAudioPlayerProps {
  videoId: string;
  isPlaying: boolean;
  startTime?: number;
  volume?: number; // 0 to 100
  onReady?: () => void;
}

export default function YouTubeAudioPlayer({
  videoId,
  isPlaying,
  startTime = 31,
  volume = 80,
  onReady
}: YouTubeAudioPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerId = "youtube-audio-player-element";
  const initAttempted = useRef<boolean>(false);

  useEffect(() => {
    // 1. Ensure the script tag is added
    const existingScript = document.getElementById("youtube-iframe-api-script");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let checkInterval: any;

    const initPlayer = () => {
      if (initAttempted.current) return;
      if (window.YT && window.YT.Player) {
        initAttempted.current = true;
        clearInterval(checkInterval);

        try {
          playerRef.current = new window.YT.Player(containerId, {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              loop: 1,
              start: startTime,
              playlist: videoId, // Required to loop a single video in YouTube Player
            },
            events: {
              onReady: (event: any) => {
                event.target.setVolume(volume);
                if (isPlaying) {
                  event.target.playVideo();
                }
                if (onReady) onReady();
              },
              onStateChange: (event: any) => {
                // If it ends, play again (backup loop)
                if (event.data === (window.YT?.PlayerState?.ENDED || 0)) {
                  event.target.playVideo();
                }
              }
            }
          });
        } catch (error) {
          console.error("Error creating YouTube Player:", error);
          initAttempted.current = false; // allow retry
        }
      }
    };

    // Initialize player if API ready, or poll until ready
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Setup global API ready callback
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };

      // Polling fallback
      checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
        }
      }, 300);
    }

    return () => {
      clearInterval(checkInterval);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore destruction errors
        }
      }
    };
  }, [videoId]);

  // Handle play/pause state updates reactively
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
      try {
        const state = playerRef.current.getPlayerState();
        // YT.PlayerState: UNSTARTED = -1, ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
        if (isPlaying) {
          if (state !== 1) {
            playerRef.current.playVideo();
          }
        } else {
          if (state === 1) {
            playerRef.current.pauseVideo();
          }
        }
      } catch (e) {
        console.warn("YouTube Player state change error:", e);
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      try {
        playerRef.current.setVolume(volume);
      } catch (e) {
        // Ignore
      }
    }
  }, [volume]);

  return (
    <div className="absolute top-0 left-0 w-1 h-1 pointer-events-none opacity-0 overflow-hidden z-[-9999]">
      <div id={containerId} />
    </div>
  );
}
