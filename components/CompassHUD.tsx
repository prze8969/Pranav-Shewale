'use client';

import React, { useState, useEffect } from 'react';
import { useSound } from './SoundEffects';

interface CompassMarker {
  id: string;
  name: string;
  angle: number; // visual offset in degrees (-120 to 120)
  icon: string;
}

const MARKERS: CompassMarker[] = [
  { id: 'hero', name: 'Overview', angle: -60, icon: '▲' },
  { id: 'quests', name: 'Experience', angle: -24, icon: '⚔' },
  { id: 'relics', name: 'Projects', angle: 0, icon: '◈' },
  { id: 'skills', name: 'Skills', angle: 24, icon: '✧' },
  { id: 'attributes', name: 'Education', angle: 48, icon: '🛡' },
  { id: 'courier', name: 'Contact', angle: 72, icon: '✉' },
];

export const CompassHUD: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const { playUiClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Determine active section
      const sections = MARKERS.map(m => document.getElementById(m.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(MARKERS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    playUiClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate rotation offset for compass bar: shifts between -60px and +60px based on scroll
  const compassOffset = (scrollProgress - 0.5) * -160;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
      {/* Dark mist header backing */}
      <div className="w-full h-20 bg-gradient-to-b from-[#080a0f]/95 via-[#0c0f17]/70 to-transparent flex flex-col items-center justify-start pt-2 px-4 backdrop-blur-[2px]">
        {/* Compass Container */}
        <div className="relative w-full max-w-2xl h-12 flex items-center justify-center overflow-hidden pointer-events-auto">
          {/* Skyrim Center Compass Diamond Pointer */}
          <div className="absolute top-0 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#dfb76c] drop-shadow-[0_0_8px_rgba(223,183,108,0.8)]" />
            <div className="w-[1px] h-3 bg-gradient-to-b from-[#dfb76c] to-transparent opacity-80" />
          </div>

          {/* Compass Horizon Strip */}
          <div
            className="flex items-center gap-12 transition-transform duration-200 ease-out select-none whitespace-nowrap text-xs font-serif tracking-[0.25em] text-[#8e98a8]"
            style={{ transform: `translateX(${compassOffset}px)` }}
          >
            <span className="opacity-40">|</span>
            <span className="text-[#a5b4c9]">NW</span>
            <span className="opacity-40">|</span>
            <span className="text-[#cba358] font-semibold text-sm">N</span>
            <span className="opacity-40">|</span>
            <span className="text-[#a5b4c9]">NE</span>
            <span className="opacity-40">|</span>
            <span className="text-[#cba358] font-semibold text-sm">E</span>
            <span className="opacity-40">|</span>
            <span className="text-[#a5b4c9]">SE</span>
            <span className="opacity-40">|</span>
            <span className="text-[#cba358] font-semibold text-sm">S</span>
            <span className="opacity-40">|</span>
            <span className="text-[#a5b4c9]">SW</span>
            <span className="opacity-40">|</span>
            <span className="text-[#cba358] font-semibold text-sm">W</span>
            <span className="opacity-40">|</span>
          </div>

          {/* Subtle Horizon Line & Center Fades */}
          <div className="absolute inset-x-0 bottom-2.5 h-[1px] bg-gradient-to-r from-transparent via-[#cba358]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0d14] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0d14] to-transparent pointer-events-none" />
        </div>

        {/* Navigation Quest Markers */}
        <nav className="flex items-center justify-center gap-2 sm:gap-6 pointer-events-auto -mt-1 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-serif">
          {MARKERS.map((marker) => {
            const isActive = activeSection === marker.id;
            return (
              <button
                key={marker.id}
                onClick={() => scrollToSection(marker.id)}
                className={`px-2 py-1 transition-all duration-200 flex items-center gap-1.5 border-b-2 ${
                  isActive
                    ? 'text-[#f3d38c] border-[#dfb76c] font-medium drop-shadow-[0_0_6px_rgba(223,183,108,0.5)]'
                    : 'text-[#8b95a5] border-transparent hover:text-[#d3dce8] hover:border-[#cba358]/40'
                }`}
              >
                <span className={`text-[9px] ${isActive ? 'text-[#dfb76c] scale-125' : 'text-[#6c7686]'}`}>
                  {marker.icon}
                </span>
                <span>{marker.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
