'use client';

import React, { useState } from 'react';
import { SKILL_CONSTELLATIONS, SkillNode } from '../data/portfolioData';
import { useSound } from './SoundEffects';
import { Star, Sparkles } from 'lucide-react';

export const PerkTree: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(SKILL_CONSTELLATIONS[0]);
  const { playObjectiveComplete } = useSound();

  const handleSelect = (skill: SkillNode) => {
    playObjectiveComplete();
    setSelectedSkill(skill);
  };

  return (
    <section id="skills" className="relative py-16 px-4 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-1.5">
        <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#cba358] uppercase">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]" />
          <span>Core Competencies</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.14em] text-[#f1ede3] uppercase">
          Technical Skills & Disciplines
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#a5b4c9] max-w-xl mx-auto">
          Interactive proficiency map across security auditing, systems engineering, and full-stack development.
        </p>
      </div>

      {/* Constellation Canvas View */}
      <div className="relative w-full h-72 sm:h-80 skyrim-panel bg-[#080b12] border border-[#2b374a] overflow-hidden mb-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]">
        {/* Subtle Nebula Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-[#1b3a6b]/20 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-[#582d75]/15 blur-[60px] pointer-events-none" />

        {/* SVG Connecting Light Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {SKILL_CONSTELLATIONS.map((node, i) => {
            const nextNode = SKILL_CONSTELLATIONS[(i + 1) % SKILL_CONSTELLATIONS.length];
            const isSelected = selectedSkill.id === node.id || selectedSkill.id === nextNode.id;
            return (
              <line
                key={`line-${i}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke={isSelected ? '#dfb76c' : '#222d3e'}
                strokeWidth={isSelected ? '2' : '1'}
                strokeDasharray={isSelected ? 'none' : '4 4'}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Constellation Star Nodes */}
        {SKILL_CONSTELLATIONS.map((node) => {
          const isSelected = selectedSkill.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            >
              <div
                className={`relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#dfb76c] shadow-[0_0_20px_rgba(223,183,108,0.8)] scale-110 border-2 border-white'
                    : 'bg-[#121a28] hover:bg-[#1a2538] border border-[#cba358]/50 hover:scale-105 shadow-[0_0_8px_rgba(203,163,88,0.2)]'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isSelected ? 'text-[#0a0d14] fill-[#0a0d14]' : 'text-[#dfb76c] group-hover:text-white'
                  }`}
                />
              </div>

              {/* Title label floating above */}
              <span
                className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-serif tracking-wider whitespace-nowrap transition-colors pointer-events-none ${
                  isSelected ? 'text-[#f1ede3] font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]' : 'text-[#8e98a8]'
                }`}
              >
                {node.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Skill Card */}
      <div className="skyrim-panel bg-[#0d121c]/95 border border-[#dfb76c]/70 p-5 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(223,183,108,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#253042] pb-3">
          <div>
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#dfb76c]">
              Skill Domain
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#f1ede3] tracking-wide">
              {selectedSkill.name}
            </h3>
          </div>
          {selectedSkill.proofPoint.url ? (
            <a
              href={selectedSkill.proofPoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-[#101c30] hover:bg-[#192b4a] border border-[#3b5987] hover:border-[#dfb76c] text-xs font-serif text-[#7bb0f8] hover:text-[#f1ede3] transition-colors flex items-center gap-1.5"
            >
              <span>{selectedSkill.proofPoint.label}</span>
              <span className="text-[10px]">↗</span>
            </a>
          ) : selectedSkill.proofPoint.targetAnchor ? (
            <button
              onClick={() => {
                const elem = document.getElementById(selectedSkill.proofPoint.targetAnchor!);
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 bg-[#101c30] hover:bg-[#192b4a] border border-[#3b5987] hover:border-[#dfb76c] text-xs font-serif text-[#7bb0f8] hover:text-[#f1ede3] transition-colors flex items-center gap-1.5"
            >
              <span>{selectedSkill.proofPoint.label}</span>
              <span className="text-[10px]">↓</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 bg-[#141d2d] border border-[#3b4b63] text-xs font-serif text-[#7bb0f8]">
              {selectedSkill.proofPoint.label}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#cbd8e6] leading-relaxed">
          {selectedSkill.description}
        </p>

        {/* Core Tooling & Concepts */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-serif uppercase tracking-widest text-[#dfb76c] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Key Tooling & Concepts</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {selectedSkill.perks.map((perk, idx) => (
              <div
                key={idx}
                className="p-2 bg-[#080b11] border border-[#20293a] flex items-center gap-2 hover:border-[#dfb76c]/50 transition-colors"
              >
                <span className="text-[#dfb76c] text-[10px]">✦</span>
                <span className="text-xs font-sans text-[#d4dde8]">
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Select Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        {SKILL_CONSTELLATIONS.map((skill) => (
          <button
            key={skill.id}
            onClick={() => handleSelect(skill)}
            className={`p-2.5 text-left border transition-all ${
              selectedSkill.id === skill.id
                ? 'bg-[#192233] border-[#dfb76c] text-[#dfb76c]'
                : 'bg-[#0a0e16]/80 border-[#222c3c] text-[#8e98a8] hover:text-[#d3dce8] hover:border-[#3d4c62]'
            }`}
          >
            <span className="text-xs font-serif tracking-wide block truncate">
              {skill.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
