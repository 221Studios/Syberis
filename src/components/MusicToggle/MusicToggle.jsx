"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

import "./MusicToggle.css";

const WAVE_CONFIG = {
  points: 80,
  stretch: 10,
  sinHeight: 1,
  speed: -0.05,
};

export default function MusicToggle() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const waveRef = useRef({ ...WAVE_CONFIG });
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = 40;

    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const wave = waveRef.current;
    const midY = size / 2;

    function render() {
      rafRef.current = requestAnimationFrame(render);

      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("color");
      ctx.lineWidth = 1.5;

      timeRef.current += 1;
      ctx.beginPath();

      let increment = 0;

      for (let i = 0; i <= wave.points; i++) {
        if (i < wave.points / 2) {
          increment += 0.1;
        } else {
          increment += -0.1;
        }

        const x = (size / wave.points) * i;
        const y =
          midY +
          Math.sin(timeRef.current * wave.speed + i / wave.stretch) *
            wave.sinHeight *
            increment;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    render();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    const wave = waveRef.current;
    if (!audio) return;

    const next = !isPlaying;
    setIsPlaying(next);

    gsap.killTweensOf(wave);

    if (next) {
      audio.play();
      gsap.to(wave, {
        sinHeight: 4,
        stretch: 5,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      audio.pause();
      gsap.to(wave, {
        sinHeight: 1,
        stretch: 10,
        duration: 0.6,
        ease: "power2.out",
      });
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
            <canvas ref={canvasRef} className="music-toggle-canvas" />
          </span>
        </button>
      </div>
    </>
  );
}
