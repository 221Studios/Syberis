"use client";

import { useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

import "./MusicToggle.css";

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !isPlaying;
    setIsPlaying(next);

    if (next) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/bg.mp3" loop />
      <div className="music-toggle-container">
        <button
          type="button"
          className={`music-toggle${isPlaying ? " music-toggle--on" : ""}`}
          onClick={handleToggle}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          <span className="music-toggle__bg" aria-hidden="true">
            <span className="music-toggle__base" />
            <span className="music-toggle__fill" />
          </span>
          <span className="music-toggle-inner">
            {isPlaying ? (
              <FiVolume2 className="music-toggle-icon" aria-hidden="true" />
            ) : (
              <FiVolumeX className="music-toggle-icon" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
