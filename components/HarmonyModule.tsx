
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface Note {
  id: string;
  name: string;
  label: string;
  color: string;
  grad: string;
  freq: number;
}

const NOTES: Note[] = [
  { id: 'c4', name: 'C4', label: 'Root', color: 'rgba(59, 130, 246, 0.7)', grad: 'from-blue-500 to-blue-700', freq: 261.63 },
  { id: 'd4', name: 'D4', label: 'Second', color: 'rgba(34, 197, 94, 0.7)', grad: 'from-green-500 to-green-700', freq: 293.66 },
  { id: 'e4', name: 'E4', label: 'Third', color: 'rgba(234, 179, 8, 0.7)', grad: 'from-yellow-400 to-yellow-600', freq: 329.63 },
  { id: 'f4', name: 'F4', label: 'Fourth', color: 'rgba(249, 115, 22, 0.7)', grad: 'from-orange-500 to-orange-700', freq: 349.23 },
  { id: 'g4', name: 'G4', label: 'Fifth', color: 'rgba(239, 68, 68, 0.7)', grad: 'from-red-500 to-red-700', freq: 392.00 },
  { id: 'a4', name: 'A4', label: 'Sixth', color: 'rgba(168, 85, 247, 0.7)', grad: 'from-purple-500 to-purple-700', freq: 440.00 },
  { id: 'b4', name: 'B4', label: 'Seventh', color: 'rgba(236, 72, 153, 0.7)', grad: 'from-pink-500 to-pink-700', freq: 493.88 },
  { id: 'c5', name: 'C5', label: 'Octave', color: 'rgba(20, 184, 166, 0.7)', grad: 'from-teal-500 to-teal-700', freq: 523.25 }
];

interface HarmonyModuleProps {
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const HarmonyModule: React.FC<HarmonyModuleProps> = ({ onBack, onNext, onPrevious, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [activeNotes, setActiveNotes] = useState<string[]>(['c4', 'e4', 'g4']);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscs = useRef<Record<string, { osc: OscillatorNode, gain: GainNode }>>({});

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startNote = (note: Note) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    osc.start();
    activeOscs.current[note.id] = { osc, gain };
  };

  const stopNote = (noteId: string) => {
    const data = activeOscs.current[noteId];
    if (data && audioCtxRef.current) {
        data.gain.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
        setTimeout(() => { try { data.osc.stop(); } catch(e) {} }, 100);
        delete activeOscs.current[noteId];
    }
  };

  useEffect(() => {
    NOTES.forEach(note => {
        const isActive = activeNotes.includes(note.id);
        const isPlaying = !!activeOscs.current[note.id];
        if (isActive && !isPlaying) startNote(note);
        else if (!isActive && isPlaying) stopNote(note.id);
    });
  }, [activeNotes]);

  useEffect(() => () => { Object.keys(activeOscs.current).forEach(stopNote); if (audioCtxRef.current) audioCtxRef.current.close(); }, []);

  const getChordName = () => {
    if (activeNotes.length === 0) return language === 'EN' ? 'No selection' : 'ไม่มีการเลือก';
    if (activeNotes.includes('c4') && activeNotes.includes('e4') && activeNotes.includes('g4') && activeNotes.length === 3) return language === 'EN' ? 'C Major (Happy)' : 'C เมเจอร์ (มีความสุข)';
    if (activeNotes.includes('f4') && activeNotes.includes('a4') && activeNotes.includes('c5') && activeNotes.length === 3) return language === 'EN' ? 'F Major' : 'F เมเจอร์';
    if (activeNotes.includes('g4') && activeNotes.includes('b4') && activeNotes.includes('d4') && activeNotes.length === 3) return language === 'EN' ? 'G Major' : 'G เมเจอร์';
    return activeNotes.length === 1 ? (language === 'EN' ? 'Single Note' : 'โน้ตตัวเดียว') : `${activeNotes.length}-Note Cluster`;
  };

  return (
    <div className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-background-light'} overflow-hidden font-display`}>
      <header className={`flex items-center justify-between border-b px-6 py-4 z-20 transition-colors ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="hidden sm:inline">{t.backToMenu[language]}</span>
          </button>
          <div className="hidden sm:flex size-10 rounded-full bg-primary/10 text-primary items-center justify-center">
            <span className="material-symbols-outlined">music_note</span>
          </div>
          <div className="hidden md:block">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>What Is Music?</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.exhibition[language]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrevious} className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined">chevron_left</span>
            <span className="hidden sm:inline">{t.prevModule[language]}</span>
          </button>
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-[#251848] text-[#FFDE59] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={onNext} className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="hidden sm:inline">{t.nextModule[language]}</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className={`w-[440px] border-r p-10 flex flex-col gap-10 shadow-2xl z-10 transition-colors overflow-y-auto ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-sm font-black uppercase tracking-widest mb-4">Module 05</div>
            <h1 className={`text-5xl font-black ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>{language === 'EN' ? 'Harmony' : 'เสียงประสาน'}</h1>
            <p className="text-gray-500 mt-2">{language === 'EN' ? 'Multiple notes played together to build texture.' : 'เสียงโน้ตหลายตัวที่เล่นพร้อมกันเพื่อสร้างมิติของเสียง'}</p>
          </div>
          
          <div className="space-y-6">
             <div className={`rounded-2xl p-6 border transition-colors ${theme === 'dark' ? 'bg-[#0F0A1A] border-[#251848]' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">{t.harmonyName[language]}</span>
                <div className="flex items-center gap-3">
                   <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
                   <span className={`text-2xl font-black ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>{getChordName()}</span>
                </div>
             </div>
             
             <div className="space-y-3">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.tryCombinations[language]}</h3>
                <div className="grid gap-2">
                  <button onClick={() => { initAudio(); setActiveNotes(['c4', 'e4', 'g4']); }} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white hover:bg-primary/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-primary/5'}`}>
                    <span>C Major (C+E+G)</span>
                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  </button>
                  <button onClick={() => { initAudio(); setActiveNotes(['f4', 'a4', 'c5']); }} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white hover:bg-primary/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-primary/5'}`}>
                    <span>F Major (F+A+C)</span>
                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  </button>
                  <button onClick={() => { initAudio(); setActiveNotes(['g4', 'b4', 'd4']); }} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white hover:bg-primary/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-primary/5'}`}>
                    <span>G Major (G+B+D)</span>
                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  </button>
                  <button onClick={() => { initAudio(); setActiveNotes(['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5']); }} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white hover:bg-primary/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-primary/5'}`}>
                    <span>Full Octave Cluster</span>
                    <span className="material-symbols-outlined text-primary text-sm">layers</span>
                  </button>
                </div>
             </div>
          </div>
          
          <div className="mt-auto">
             <button onClick={() => setActiveNotes([])} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-[#251848] text-[#9B7EC8] hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                <span className="material-symbols-outlined">restart_alt</span>
                {t.reset[language]}
             </button>
          </div>
        </aside>

        <section className={`flex-1 flex flex-col overflow-hidden stage-grid relative transition-colors ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-background-light'}`}>
           <div className="flex-1 flex items-center justify-center p-20 relative">
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                 {NOTES.map((note, i) => activeNotes.includes(note.id) && (
                    <div key={note.id} style={{ backgroundColor: note.color, transform: `translate(${(i - 4) * 35}px, ${(i % 2 === 0 ? 1 : -1) * 30}px)`, filter: 'blur(35px)', opacity: 0.8 }} className="absolute w-72 h-72 rounded-full blend-multiply animate-pulse" />
                 ))}
                 {activeNotes.length > 0 && <div className="absolute w-40 h-40 bg-white/40 blur-[50px] rounded-full animate-pulse shadow-inner" />}
              </div>
           </div>
           
           <div className={`w-full border-t px-10 pt-10 pb-10 z-20 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
              <div className="max-w-5xl mx-auto flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {NOTES.map((note) => (
                    <button 
                        key={note.id} 
                        onClick={() => { initAudio(); setActiveNotes(prev => prev.includes(note.id) ? prev.filter(n => n !== note.id) : [...prev, note.id]); }} 
                        className={`flex flex-col items-center gap-4 transition-all duration-500 min-w-[100px] ${activeNotes.includes(note.id) ? 'scale-105 pt-8' : 'pt-0 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                    >
                        <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${note.grad} shadow-2xl flex items-center justify-center relative overflow-hidden group`}>
                            <span className="text-white font-black text-3xl drop-shadow-md">{note.name}</span>
                            {activeNotes.includes(note.id) && (
                               <div className="absolute inset-0 border-4 border-white/50 rounded-[2rem]"></div>
                            )}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{note.label}</span>
                    </button>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default HarmonyModule;
