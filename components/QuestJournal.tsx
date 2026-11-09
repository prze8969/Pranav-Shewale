'use client';

import React, { useState } from 'react';
import { QUESTS, QuestItem } from '../data/portfolioData';
import { useSound } from './SoundEffects';
import { Briefcase, MapPin, ChevronRight, ExternalLink, Layers, Trophy, Video, FileText } from 'lucide-react';

export const QuestJournal: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<QuestItem>(QUESTS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'work' | 'competition'>('all');
  const [showFullDetails, setShowFullDetails] = useState<boolean>(true);
  const { playQuestOpen, playUiClick } = useSound();

  const handleSelectQuest = (quest: QuestItem) => {
    playQuestOpen();
    setSelectedQuest(quest);
  };

  const filteredQuests = QUESTS.filter((q) => {
    if (activeTab === 'all') return true;
    return q.type === activeTab;
  });

  return (
    <section id="quests" className="relative py-16 px-4 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-1.5">
        <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#cba358] uppercase">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]" />
          <span>Professional Background & Trials</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.14em] text-[#f1ede3] uppercase">
          Experience & Competitions
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#a5b4c9] max-w-xl mx-auto">
          Production smart contract auditing, clinical digital twin simulation, and hackathon engineering trials.
        </p>
      </div>

      {/* Filter Tabs — Clearly distinguishing Employment vs Competitions */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'work', label: 'Work & Research (2)' },
          { id: 'competition', label: 'Hackathons & Competitions (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playUiClick();
              setActiveTab(tab.id as any);
            }}
            className={`px-3.5 py-1 text-xs font-serif tracking-[0.15em] uppercase transition-all border ${
              activeTab === tab.id
                ? 'bg-[#182133] border-[#dfb76c] text-[#dfb76c] shadow-[0_0_12px_rgba(223,183,108,0.2)]'
                : 'bg-[#0e121a]/80 border-[#384354] text-[#8e98a8] hover:text-[#d3dce8] hover:border-[#586882]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 skyrim-panel bg-[#0b0e15]/90 border border-[#3b4759] p-2.5 divide-y divide-[#1e2636]">
          <div className="px-2.5 py-1.5 text-[10px] font-serif uppercase tracking-[0.2em] text-[#7d8b9d] flex items-center justify-between">
            <span>Dossier Index ({filteredQuests.length})</span>
            <span className="text-[#dfb76c] font-mono">SELECT ENTRY</span>
          </div>

          <div className="space-y-1 pt-1.5">
            {filteredQuests.map((quest) => {
              const isSelected = selectedQuest.id === quest.id;
              const isWork = quest.type === 'work';
              return (
                <button
                  key={quest.id}
                  onClick={() => handleSelectQuest(quest)}
                  className={`w-full text-left p-3 transition-all flex items-start justify-between border ${
                    isSelected
                      ? 'bg-[#161e2e] border-[#dfb76c] text-[#f1ede3] shadow-[inset_0_0_10px_rgba(223,183,108,0.15)]'
                      : 'bg-[#0f1420]/50 border-transparent hover:bg-[#131926] hover:border-[#384354] text-[#a5b4c9]'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isSelected ? 'text-[#dfb76c]' : 'text-[#6c7686]'}`}>
                        {isWork ? '◆' : '✦'}
                      </span>
                      <h3 className="font-serif text-xs sm:text-sm tracking-wide font-medium text-inherit">
                        {quest.company}
                      </h3>
                      {quest.categoryLabel && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121927] border border-[#253347] text-[#7bb0f8]">
                          {quest.categoryLabel}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-sans text-[#8e9eb3] pl-3.5">
                      {quest.role}
                    </div>
                    {/* 1-sentence visible summary right on card */}
                    <p className="text-[11px] font-sans text-[#6c798d] pl-3.5 line-clamp-1">
                      {quest.oneLineSummary}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#172030] border border-[#2b374a] text-[#a5b4c9]">
                      {quest.period}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-[#dfb76c]' : 'text-transparent'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="lg:col-span-7 skyrim-panel bg-[#0d121c]/95 border border-[#dfb76c]/70 p-5 sm:p-7 space-y-5 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="border-b border-[#253042] pb-4 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-serif uppercase tracking-wider text-[#dfb76c]">
              <span className="flex items-center gap-1.5 font-medium">
                {selectedQuest.type === 'work' ? (
                  <Briefcase className="w-3.5 h-3.5 text-[#dfb76c]" />
                ) : (
                  <Trophy className="w-3.5 h-3.5 text-[#dfb76c]" />
                )}
                {selectedQuest.company}
              </span>
              <span className="text-[11px] font-mono text-[#8e9eb3]">
                {selectedQuest.period}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif tracking-wide text-[#f1ede3] font-normal">
              {selectedQuest.role}
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-sans text-[#8e9eb3]">
              <MapPin className="w-3 h-3 text-[#cba358]" />
              <span>{selectedQuest.location}</span>
            </div>
          </div>

          {/* 1-Sentence Summary (Always Visible) */}
          <div className="p-3 bg-[#0a0e16] border-l-2 border-[#dfb76c] text-xs sm:text-sm font-sans text-[#d4dde8] leading-relaxed">
            {selectedQuest.oneLineSummary}
          </div>

          {/* Video Preview Demos for Bynocs / EyeTwin */}
          {selectedQuest.media && selectedQuest.media.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-serif uppercase tracking-wider text-[#dfb76c] border-b border-[#222d3e] pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#7bb0f8]" />
                  <span>Simulation Proof Videos & Render Demos</span>
                </span>
                <span className="text-[10px] font-mono text-[#8e9eb3]">
                  {selectedQuest.media.length} Cliped Demonstrations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedQuest.media.map((med, i) => (
                  <div key={i} className="p-2.5 bg-[#080c14] border border-[#253246] rounded flex flex-col justify-between space-y-2">
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-36 object-contain bg-black rounded border border-[#1b2636]"
                    >
                      <source src={med.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div>
                      <h4 className="text-xs font-serif text-[#f1ede3] font-medium">
                        {med.title}
                      </h4>
                      <p className="text-[11px] font-sans text-[#8e9eb3] leading-tight mt-0.5">
                        {med.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CelestialE Prototype Note under Sovriigne */}
          {selectedQuest.prototypeNote && (
            <div className="p-2.5 bg-[#0a101d] border border-[#233550] text-xs font-sans text-[#8eb0db] flex items-start gap-2">
              <Layers className="w-3.5 h-3.5 text-[#5493ea] shrink-0 mt-0.5" />
              <span>{selectedQuest.prototypeNote}</span>
            </div>
          )}

          {/* Collapsible / Expandable Details */}
          <div>
            <button
              onClick={() => {
                playUiClick();
                setShowFullDetails(!showFullDetails);
              }}
              className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-[#dfb76c] hover:text-[#f3d38c] transition-colors mb-2"
            >
              <span>{showFullDetails ? 'Hide Accomplishments ▲' : 'View Accomplishments ▼'}</span>
            </button>

            {showFullDetails && (
              <div className="space-y-2 mt-2 pt-2 border-t border-[#1e2738] animate-fadeIn">
                <div className="space-y-2">
                  {selectedQuest.bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-start justify-between gap-2 text-xs font-sans text-[#bcc7d6] leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="text-[#dfb76c] text-[10px] mt-1 shrink-0">◈</span>
                        <span>{point.text}</span>
                      </div>
                      {point.proofLabel && (
                        point.proofUrl ? (
                          <a
                            href={point.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 ml-2 text-[10px] font-mono px-2 py-0.5 bg-[#121c2d] hover:bg-[#1a2c47] border border-[#2c4366] text-[#7bb0f8] hover:text-white transition-colors flex items-center gap-1"
                          >
                            <span>{point.proofLabel}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="shrink-0 ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-[#141822] border border-[#262f3f] text-[#8e98a8]">
                            {point.proofLabel}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5 pt-2 border-t border-[#1e2738]">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d8b9d] block">
              Technologies & Standards
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedQuest.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-[#121824] border border-[#2b374a] text-[10px] font-mono text-[#cbd8e6]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links & External Documents */}
          {selectedQuest.links && selectedQuest.links.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {selectedQuest.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#172132] hover:bg-[#202e46] border border-[#dfb76c]/70 text-[#f1ede3] font-serif text-[11px] uppercase tracking-wider transition-all"
                >
                  {link.isExternalDoc ? (
                    <FileText className="w-3 h-3 text-[#dfb76c]" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-[#dfb76c]" />
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
