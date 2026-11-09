'use client';

import React, { useState } from 'react';
import { CHARACTER_DATA } from '../data/portfolioData';
import { useSound } from './SoundEffects';
import { Mail, Send, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const CourierContact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const { playUiClick, playObjectiveComplete } = useSound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playObjectiveComplete();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="courier" className="relative py-16 px-4 max-w-4xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-1.5">
        <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#cba358] uppercase">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#cba358]" />
          <span>Get in Touch</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#cba358]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.14em] text-[#f1ede3] uppercase">
          Contact & Inquiries
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#a5b4c9] max-w-xl mx-auto">
          Open for smart contract security audits, protocol engineering, and systems collaboration.
        </p>
      </div>

      {/* Parchment Styled Courier Card */}
      <div className="skyrim-panel bg-[#0d121c]/95 border-2 border-[#dfb76c] p-5 sm:p-8 space-y-6 relative shadow-[0_0_35px_rgba(223,183,108,0.15)]">
        {/* Wax Seal Graphic in Top Corner */}
        <div className="absolute -top-5 right-6 w-10 h-10 rounded-full bg-[#7a1c1c] border border-[#b53a3a] flex items-center justify-center shadow-lg shadow-black/80">
          <span className="text-[#e8a2a2] font-serif text-xs font-bold">PS</span>
        </div>

        {/* Direct Contact Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`mailto:${CHARACTER_DATA.email}`}
            onClick={playUiClick}
            className="p-3.5 bg-[#080b11] border border-[#2d3a4d] hover:border-[#dfb76c] transition-all flex flex-col items-center text-center group"
          >
            <Mail className="w-5 h-5 text-[#dfb76c] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#8e98a8]">Direct Email</span>
            <span className="text-xs font-mono text-[#d4dde8] mt-0.5 break-all">{CHARACTER_DATA.email}</span>
          </a>

          <a
            href={CHARACTER_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="p-3.5 bg-[#080b11] border border-[#2d3a4d] hover:border-[#dfb76c] transition-all flex flex-col items-center text-center group"
          >
            <GithubIcon className="w-5 h-5 text-[#dfb76c] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#8e98a8]">GitHub</span>
            <span className="text-xs font-mono text-[#d4dde8] mt-0.5">github.com/prze8969</span>
          </a>

          <a
            href={CHARACTER_DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="p-3.5 bg-[#080b11] border border-[#2d3a4d] hover:border-[#dfb76c] transition-all flex flex-col items-center text-center group"
          >
            <LinkedinIcon className="w-5 h-5 text-[#dfb76c] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#8e98a8]">LinkedIn</span>
            <span className="text-xs font-mono text-[#d4dde8] mt-0.5">pranav-shewale-prze8969</span>
          </a>
        </div>

        {/* Dispatch Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3 border-t border-[#20293a]">
          <h3 className="text-xs font-serif uppercase tracking-[0.2em] text-[#dfb76c]">
            Send a Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-serif uppercase tracking-wider text-[#8e98a8] mb-1">
                Your Name / Organization
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="e.g. Audit Firm / Engineering Team"
                className="w-full bg-[#080b11] border border-[#2b374a] focus:border-[#dfb76c] p-2 text-xs text-[#f1ede3] font-sans outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-serif uppercase tracking-wider text-[#8e98a8] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="e.g. contact@domain.com"
                className="w-full bg-[#080b11] border border-[#2b374a] focus:border-[#dfb76c] p-2 text-xs text-[#f1ede3] font-sans outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#8e98a8] mb-1">
              Message / Inquiries
            </label>
            <textarea
              rows={3}
              required
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder="Inquiries regarding smart contract audits, security reviews, full-stack architecture, or technical roles..."
              className="w-full bg-[#080b11] border border-[#2b374a] focus:border-[#dfb76c] p-2 text-xs text-[#f1ede3] font-sans outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-sans text-[#7d8b9d]">
              Direct correspondence via shewalepranav66@gmail.com
            </span>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#172235] hover:bg-[#202f4a] border border-[#dfb76c] text-[#f1ede3] font-serif text-xs uppercase tracking-[0.18em] transition-all shadow-[0_0_15px_rgba(223,183,108,0.2)] hover:shadow-[0_0_20px_rgba(223,183,108,0.4)]"
            >
              {sent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#7bf898]" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 space-y-1.5 text-xs font-serif tracking-widest text-[#6c798d]">
        <p className="uppercase text-[11px]">
          PRANAV SHEWALE · VESIT MUMBAI (CMPN) · IIT MADRAS · SOVRIIGNE
        </p>
        <p className="text-[10px] opacity-70 font-sans">
          Built with Next.js 14, TypeScript, Tailwind CSS, and Web Audio API.
        </p>
      </div>
    </section>
  );
};
