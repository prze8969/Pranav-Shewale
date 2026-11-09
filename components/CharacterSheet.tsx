'use client';

import React from 'react';
import { CHARACTER_DATA } from '../data/portfolioData';
import { GraduationCap, Cpu, CheckCircle } from 'lucide-react';

export const CharacterSheet: React.FC = () => {
  return (
    <section id="attributes" className="relative py-16 px-4 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-1.5">
        <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#cba358] uppercase">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]" />
          <span>Credentials & Equipment</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.14em] text-[#f1ede3] uppercase">
          Education & Systems
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#a5b4c9] max-w-xl mx-auto">
          Academic performance metrics, dual university programs, and hardware infrastructure.
        </p>
      </div>

      {/* Scannable 2-Column Stat Grid (0 prose paragraphs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Academic Credentials */}
        <div className="skyrim-panel bg-[#0d121c]/90 border border-[#384354] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#242f40] pb-3">
            <h3 className="text-base font-serif uppercase tracking-wider text-[#dfb76c] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#dfb76c]" />
              <span>Academic Degrees & Scores</span>
            </h3>
            <span className="text-[10px] font-mono text-[#7bb0f8] uppercase bg-[#131d2e] px-2 py-0.5 border border-[#2b3e5c]">
              Concurrent
            </span>
          </div>

          <div className="space-y-3">
            {CHARACTER_DATA.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#090d14] border border-[#202a3a] space-y-2 hover:border-[#dfb76c]/60 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-serif text-sm text-[#f1ede3] font-medium">
                      {edu.institution}
                    </h4>
                    <p className="text-xs font-sans text-[#a5b4c9]">
                      {edu.degree}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-[#172233] border border-[#384a66] text-xs font-serif text-[#dfb76c] font-bold shrink-0">
                    {edu.score}
                  </span>
                </div>

                <div className="text-[11px] font-sans text-[#7d8b9d] flex items-center justify-between pt-1 border-t border-[#17202e]">
                  <span>Status:</span>
                  <span className="text-[#7bf898]">{edu.status}</span>
                </div>

                <p className="text-[11px] font-sans text-[#9eb0c6]">
                  {edu.highlights}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Academic Competencies */}
          <div className="pt-2 border-t border-[#202a3a]">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d8b9d] block mb-2">
              Core Coursework & Foundations
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Data Structures & Algorithms",
                "Computer Architecture",
                "Cryptography",
                "Linear Algebra",
                "Operating System Internals",
                "Database Management Systems",
                "Probability & Statistics",
                "Discrete Mathematics",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[10px] font-mono px-2 py-0.5 bg-[#141b27] border border-[#273243] text-[#cbd8e6]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hardware & Systems Grid */}
        <div className="skyrim-panel bg-[#0d121c]/90 border border-[#384354] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#242f40] pb-3">
            <h3 className="text-base font-serif uppercase tracking-wider text-[#dfb76c] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#dfb76c]" />
              <span>Hardware & Infrastructure</span>
            </h3>
            <span className="text-[10px] font-mono text-[#7bf898] uppercase bg-[#112419] px-2 py-0.5 border border-[#1f472f]">
              Active
            </span>
          </div>

          <div className="space-y-3">
            {CHARACTER_DATA.hardwareAndSystems.map((hw, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#090d14] border border-[#202a3a] space-y-1.5 hover:border-[#dfb76c]/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#dfb76c]">
                    {hw.label}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#f1ede3]">
                  {hw.value}
                </div>
                <p className="text-[11px] font-sans text-[#8e9eb3] leading-snug">
                  {hw.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Low-Level Skills Checklist */}
          <div className="pt-2 border-t border-[#202a3a]">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d8b9d] block mb-2">
              Systems Engineering Competencies
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-sans text-[#a5b4c9]">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>Alpine Linux Dual-Boot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>RAID Storage Arrays</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>TestDisk I/O Recovery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>GRUB & i915 Kernel Patches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>NTFS UAS Workarounds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#dfb76c] shrink-0" />
                <span>Discrete Logic Redstone ALU</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
