'use client';

import React, { useState } from 'react';
import { PROJECTS, ProjectItem } from '../data/portfolioData';
import { useSound } from './SoundEffects';
import { Sparkles, Layers, Cpu, Eye, X, ExternalLink, FileText, Mail } from 'lucide-react';
import { GithubIcon } from './Icons';

export const InventoryGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'web3-systems' | 'experiments'>('all');
  const [inspectedItem, setInspectedItem] = useState<ProjectItem | null>(null);
  const { playUiClick, playQuestOpen } = useSound();

  const handleInspect = (item: ProjectItem) => {
    playQuestOpen();
    setInspectedItem(item);
  };

  const closeInspect = () => {
    playUiClick();
    setInspectedItem(null);
  };

  const filteredItems = PROJECTS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="relics" className="relative py-16 px-4 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-1.5">
        <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#cba358] uppercase">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]" />
          <span>Selected Work & Systems</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.14em] text-[#f1ede3] uppercase">
          Featured Projects
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#a5b4c9] max-w-xl mx-auto">
          Flagship Web3 protocols, decentralized marketplaces, and low-level systems architectures.
        </p>
      </div>

      {/* Sniper Filter Tabs — Flagships first, experiments segregated */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'all', label: 'All Projects (9)', icon: Sparkles },
          { id: 'web3-systems', label: 'Flagship Web3 & Systems (4)', icon: Layers },
          { id: 'experiments', label: 'Other Experiments & Utilities (5)', icon: Cpu },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playUiClick();
                setActiveCategory(cat.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif tracking-[0.15em] uppercase transition-all border ${
                isActive
                  ? 'bg-[#1a2336] border-[#dfb76c] text-[#dfb76c] shadow-[0_0_12px_rgba(223,183,108,0.2)]'
                  : 'bg-[#0e121a]/80 border-[#384354] text-[#8e98a8] hover:text-[#d3dce8] hover:border-[#586882]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Clean Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="skyrim-panel bg-[#0d121c]/90 border border-[#384354] hover:border-[#dfb76c]/80 transition-all p-5 flex flex-col justify-between group hover:shadow-[0_0_20px_rgba(223,183,108,0.15)]"
          >
            <div className="space-y-2.5">
              {/* Project Title & Tagline */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-serif tracking-wide text-[#f1ede3] group-hover:text-[#dfb76c] transition-colors">
                    {item.title}
                  </h3>
                  {item.links.live && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#102919] border border-[#235832] text-[#7bf898] uppercase">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs font-serif text-[#dfb76c] tracking-wide mt-0.5">
                  {item.tagline}
                </p>
              </div>

              {/* Visual Preview / Badge Thumbnail */}
              {item.visualPreview && (
                <div className="relative rounded overflow-hidden border border-[#233044] bg-[#080c14] py-2 px-3 flex items-center justify-between text-xs text-[#8e9eb3] font-mono">
                  <span className="flex items-center gap-1.5 text-[#7bb0f8]">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                    {item.visualPreview.badgeText || "Visual Evidence Available"}
                  </span>
                  {item.links.pdf && (
                    <a
                      href={item.links.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#dfb76c] hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>View PDF</span>
                    </a>
                  )}
                </div>
              )}

              {/* 1-Line Real Description */}
              <p className="text-xs font-sans text-[#a5b4c9] leading-relaxed line-clamp-2">
                {item.oneLineSummary}
              </p>

              {/* Status Note if private/in-development */}
              {item.statusNote && (
                <div className="text-[11px] font-sans text-[#e5a854] bg-[#1d160c] border border-[#443118] px-2 py-1 rounded">
                  ✦ {item.statusNote}
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.techStack.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#121824] border border-[#273243] text-[#8e9eb3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Clean Footer */}
            <div className="pt-3.5 mt-3.5 border-t border-[#1e2738] flex items-center justify-between">
              <button
                onClick={() => handleInspect(item)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#121826] hover:bg-[#1b253b] border border-[#384354] hover:border-[#dfb76c] text-[#d4dde8] hover:text-[#f1ede3] text-xs font-serif uppercase tracking-wider transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>Inspect Details</span>
              </button>

              <div className="flex items-center gap-1.5">
                {item.links.live && (
                  <a
                    href={item.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#121826] hover:bg-[#1b253b] border border-[#384354] hover:border-[#dfb76c] text-[#dfb76c] transition-all"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {item.links.github && (
                  <a
                    href={item.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#121826] hover:bg-[#1b253b] border border-[#384354] hover:border-[#dfb76c] text-[#d4dde8] transition-all"
                    title="Project GitHub Repository"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {item.links.caseStudyRequest && (
                  <a
                    href={`mailto:shewalepranav66@gmail.com?subject=Case%20Study%20Request:%20${encodeURIComponent(item.title)}`}
                    className="p-1.5 bg-[#121826] hover:bg-[#1b253b] border border-[#384354] hover:border-[#dfb76c] text-[#a5b4c9] hover:text-[#dfb76c] transition-all"
                    title="Request Case Study"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal — Full Details Behind Click */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl skyrim-panel bg-[#0d121c] border-2 border-[#dfb76c] p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeInspect}
              className="absolute top-4 right-4 p-1 text-[#8e98a8] hover:text-[#dfb76c] border border-transparent hover:border-[#dfb76c]/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#253042] pb-3 space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif text-[#f1ede3] tracking-wide">
                {inspectedItem.title}
              </h3>
              <p className="text-xs font-serif text-[#dfb76c] tracking-wider">
                {inspectedItem.tagline}
              </p>
            </div>

            {/* Status Note if applicable */}
            {inspectedItem.statusNote && (
              <div className="p-2.5 bg-[#1b150c] border border-[#523b18] text-xs font-sans text-[#f0bb6c] rounded">
                ✦ {inspectedItem.statusNote}
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm font-sans text-[#cbd8e6] leading-relaxed">
              {inspectedItem.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2 pt-1">
              <h4 className="text-[11px] font-serif uppercase tracking-widest text-[#dfb76c]">
                Architecture Highlights & Scope
              </h4>
              <ul className="space-y-1.5 text-xs font-sans text-[#bcc7d6]">
                {inspectedItem.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#dfb76c] text-[10px] mt-0.5 shrink-0">◈</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5 pt-2 border-t border-[#1e2738]">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d8b9d] block">
                Full Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectedItem.techStack.map((t) => (
                  <span key={t} className="text-[11px] font-mono px-2 py-0.5 bg-[#141b27] border border-[#2b374a] text-[#cbd8e6]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#1e2738] flex flex-wrap justify-end gap-2">
              {inspectedItem.links.live && (
                <a
                  href={inspectedItem.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#102419] hover:bg-[#1a3827] border border-[#38854f] text-[#7bf898] font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live App</span>
                </a>
              )}
              {inspectedItem.links.pdf && (
                <a
                  href={inspectedItem.links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#172030] hover:bg-[#202d44] border border-[#dfb76c] text-[#dfb76c] font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Technical Presentation PDF</span>
                </a>
              )}
              {inspectedItem.links.github && (
                <a
                  href={inspectedItem.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#172030] hover:bg-[#202d44] border border-[#dfb76c] text-[#f1ede3] font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>Project Repository</span>
                </a>
              )}
              {inspectedItem.links.caseStudyRequest && (
                <a
                  href={`mailto:shewalepranav66@gmail.com?subject=Case%20Study%20Request:%20${encodeURIComponent(inspectedItem.title)}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#172030] hover:bg-[#202d44] border border-[#dfb76c] text-[#f1ede3] font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>Case Study on Request</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
