'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playUiClick: () => void;
  playQuestOpen: () => void;
  playObjectiveComplete: () => void;
  playLevelUp: () => void;
  playShout: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playUiClick: () => {},
  playQuestOpen: () => {},
  playObjectiveComplete: () => {},
  playLevelUp: () => {},
  playShout: () => {}
});

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first interaction
    const initAudio = () => {
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          setAudioCtx(ctx);
        }
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, [audioCtx]);

  const getCtx = useCallback(() => {
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        setAudioCtx(ctx);
        return ctx;
      }
      return null;
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }, [audioCtx]);

  // Subtle wooden parchment UI click
  const playUiClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context error fallback
    }
  }, [isMuted, getCtx]);

  // Deep Skyrim quest book turn / menu open resonance
  const playQuestOpen = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(75, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }, [isMuted, getCtx]);

  // Quest objective completed chime
  const playObjectiveComplete = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    try {
      const notes = [440, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.3);
      });
    } catch {}
  }, [isMuted, getCtx]);

  // Dovahkiin Level Up Fanfare
  const playLevelUp = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    try {
      // Norse choir-like chords: D minor to F major to G
      const chords = [
        { freqs: [146.83, 220, 293.66], time: 0, duration: 0.35 },
        { freqs: [174.61, 261.63, 349.23], time: 0.32, duration: 0.4 },
        { freqs: [196.00, 293.66, 392.00, 587.33], time: 0.7, duration: 0.9 }
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(700, ctx.currentTime + chord.time);

          osc.frequency.setValueAtTime(freq, ctx.currentTime + chord.time);

          gain.gain.setValueAtTime(0.05, ctx.currentTime + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chord.time + chord.duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + chord.time);
          osc.stop(ctx.currentTime + chord.time + chord.duration + 0.05);
        });
      });
    } catch {}
  }, [isMuted, getCtx]);

  // Thu'um Shout Sonic Pulse
  const playShout = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.45);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.55);
    } catch {}
  }, [isMuted, getCtx]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playUiClick, playQuestOpen, playObjectiveComplete, playLevelUp, playShout }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);

export const SoundToggle: React.FC = () => {
  const { isMuted, toggleMute, playUiClick } = useSound();

  const handleToggle = () => {
    if (isMuted) {
      toggleMute();
      playUiClick();
    } else {
      toggleMute();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0c1017]/90 border border-[#2b394d] hover:border-[#dfb76c] px-3 py-1.5 text-xs font-mono tracking-wider text-[#a5b4c9] hover:text-[#f1ede3] backdrop-blur-md transition-all shadow-md rounded-sm"
      title={isMuted ? "Enable Sound Effects (Opt-in)" : "Mute Sound Effects"}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#7a8b9d]" />
          <span className="text-[11px]">Sound: Off</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span className="text-[11px] text-[#dfb76c]">Sound: On</span>
        </>
      )}
    </button>
  );
};
