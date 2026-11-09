'use client';

import React from 'react';
import { CHARACTER_DATA } from '../data/portfolioData';
import { useSound } from './SoundEffects';
import { Shield, Sparkles, Terminal, ArrowRight } from 'lucide-react';

export const HeroDovahkiin: React.FC = () => {
  const { playUiClick } = useSound();

  const scrollTo = (id: string) => {
    playUiClick();
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-14 px-4 text-center z-10">
      {/* Subtle Emblem */}
      <div className="relative mb-3">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#cba358]/50 bg-[#0e131d]/90 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(203,163,88,0.2)]">
          <Shield className="w-7 h-7 text-[#dfb76c]" />
        </div>
      </div>

      {/* Main Header — Max 2 lines of copy before fold */}
      <div className="max-w-3xl mx-auto space-y-2.5">
        <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs font-serif tracking-[0.25em] text-[#a5b4c9] uppercase">
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]/60" />
          <span>{CHARACTER_DATA.role}</span>
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]/60" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-[0.14em] text-[#f1ede3] font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          {CHARACTER_DATA.name.toUpperCase()}
        </h1>

        {/* Crisp 2-line summary — recruiter understands immediately */}
        <p className="text-sm sm:text-base text-[#c8d4e2] max-w-2xl mx-auto font-sans leading-relaxed pt-1">
          {CHARACTER_DATA.quickBio}
        </p>
      </div>

      {/* Clean 3-Pillar Proof Bars (Magicka, Health, Stamina visual skin, real proof points) */}
      <div className="w-full max-w-3xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left font-serif">
        {/* Magicka Bar */}
        <div className="skyrim-panel p-3.5 bg-[#0b0e15]/85 border border-[#2b4c7e]/60 hover:border-[#4d7bc2] transition-colors">
          <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-1.5">
            <span className="text-[#7bb0f8] flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#5493ea]" /> {CHARACTER_DATA.vitalStats.magicka.label}
            </span>
            <span className="text-[#7bb0f8] text-[10px] font-mono px-1.5 py-0.5 bg-[#101c30] border border-[#233a60] uppercase">
              {CHARACTER_DATA.vitalStats.magicka.proof}
            </span>
          </div>
          <div className="h-1 w-full bg-[#0a101d] border border-[#1e345b] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#173a74] via-[#2c65bf] to-[#5d9af8] w-full" />
          </div>
          <p className="text-[11px] text-[#8e9eb3] mt-2 font-sans leading-snug">
            {CHARACTER_DATA.vitalStats.magicka.detail}
          </p>
        </div>

        {/* Health Bar */}
        <div className="skyrim-panel p-3.5 bg-[#0b0e15]/85 border border-[#7a2424]/60 hover:border-[#b13a3a] transition-colors">
          <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-1.5">
            <span className="text-[#f87b7b] flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#e54545]" /> {CHARACTER_DATA.vitalStats.health.label}
            </span>
            <span className="text-[#f87b7b] text-[10px] font-mono px-1.5 py-0.5 bg-[#260e0e] border border-[#541e1e] uppercase">
              {CHARACTER_DATA.vitalStats.health.proof}
            </span>
          </div>
          <div className="h-1 w-full bg-[#180a0a] border border-[#5b1e1e] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#6e1919] via-[#b82929] to-[#f25c5c] w-full" />
          </div>
          <p className="text-[11px] text-[#8e9eb3] mt-2 font-sans leading-snug">
            {CHARACTER_DATA.vitalStats.health.detail}
          </p>
        </div>

        {/* Stamina Bar */}
        <div className="skyrim-panel p-3.5 bg-[#0b0e15]/85 border border-[#235832]/60 hover:border-[#38854f] transition-colors">
          <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-1.5">
            <span className="text-[#7bf898] flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5 text-[#38b25e]" /> {CHARACTER_DATA.vitalStats.stamina.label}
            </span>
            <span className="text-[#7bf898] text-[10px] font-mono px-1.5 py-0.5 bg-[#0c2414] border border-[#194c29] uppercase">
              {CHARACTER_DATA.vitalStats.stamina.proof}
            </span>
          </div>
          <div className="h-1 w-full bg-[#0a180e] border border-[#173d22] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#175228] via-[#24803e] to-[#5bf887] w-full" />
          </div>
          <p className="text-[11px] text-[#8e9eb3] mt-2 font-sans leading-snug">
            {CHARACTER_DATA.vitalStats.stamina.detail}
          </p>
        </div>
      </div>

      {/* Quick Jump Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <button
          onClick={() => scrollTo('quests')}
          className="flex items-center gap-2 px-4 py-2 bg-[#141a27] hover:bg-[#1e273a] border border-[#dfb76c] text-[#f1ede3] font-serif text-xs uppercase tracking-[0.16em] transition-all shadow-[0_0_15px_rgba(223,183,108,0.15)] hover:shadow-[0_0_20px_rgba(223,183,108,0.3)]"
        >
          <span>Work Experience</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#dfb76c]" />
        </button>

        <button
          onClick={() => scrollTo('relics')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f141f] hover:bg-[#192133] border border-[#586882] hover:border-[#dfb76c] text-[#d4dde8] hover:text-[#f1ede3] font-serif text-xs uppercase tracking-[0.16em] transition-all"
        >
          <span>Featured Projects</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7bb0f8]" />
        </button>

        <button
          onClick={() => scrollTo('skills')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f141f] hover:bg-[#192133] border border-[#586882] hover:border-[#dfb76c] text-[#d4dde8] hover:text-[#f1ede3] font-serif text-xs uppercase tracking-[0.16em] transition-all"
        >
          <span>Technical Skills</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#a5b4c9]" />
        </button>

        <button
          onClick={() => scrollTo('courier')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f141f] hover:bg-[#192133] border border-[#586882] hover:border-[#dfb76c] text-[#d4dde8] hover:text-[#f1ede3] font-serif text-xs uppercase tracking-[0.16em] transition-all"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7bf898]" />
        </button>
      </div>
    </section>
  );
};
