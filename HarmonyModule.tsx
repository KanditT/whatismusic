
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
  { id: 'c3', name: 'C3', label: 'Root', color: 'rgba(59, 130, 246, 0.7)', grad: 'from-blue-500 to-blue-700', freq: 130.81 },
  { id: 'd3', name: 'D3', label: 'Second', color: 'rgba(34, 197, 94, 0.7)', grad: 'from-green-500 to-green-700', freq: 146.83 },
  { id: 'e3', name: 'E3', label: 'Third', color: 'rgba(234, 179, 8, 0.7)', grad: 'from-yellow-400 to-yellow-600', freq: 164.81 },
  { id: 'f3', name: 'F3', label: 'Fourth', color: 'rgba(249, 115, 22, 0.7)', grad: 'from-orange-500 to-orange-700', freq: 174.61 },
  { id: 'g3', name: 'G3', label: 'Fifth', color: 'rgba(239, 68, 68, 0.7)', grad: 'from-red-500 to-red-700', freq: 196.00 },
  { id: 'a3', name: 'A3', label: 'Sixth', color: 'rgba(168, 85, 247, 0.7)', grad: 'from-purple-500 to-purple-700', freq: 220.00 },
  { id: 'b3', name: 'B3', label: 'Seventh', color: 'rgba(236, 72, 153, 0.7)', grad: 'from-pink-500 to-pink-700', freq: 246.94 },
  { id: 'c4', name: 'C4', label: 'Octave', color: 'rgba(20, 184, 166, 0.7)', grad: 'from-teal-500 to-teal-700', freq: 261.63 }
];

interface HarmonyModuleProps {
  onBack: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const HarmonyModule: React.FC<HarmonyModuleProps> = ({ onBack, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [activeNotes, setActiveNotes] = useState<string[]>(['c3', 'e3', 'g3']);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscs = useRef<Record<string, { osc: OscillatorNode, gain: GainNode }>>({});

  const initAudio = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
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
    if (activeNotes.includes('c3') && activeNotes.includes('e3') && activeNotes.includes('g3') && activeNotes.length === 3) return language === 'EN' ? 'C Major (Happy)' : 'C เมเจอร์ (มีความสุข)';
    return activeNotes.length === 1 ? (language === 'EN' ? 'Single Note' : 'โน้ตตัวเดียว') : `${activeNotes.length}-Note Cluster`;
  };

  return (
    <div className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-background-light'} overflow-hidden font-display`}>
      <header className={`flex items-center justify-between border-b px-6 py-4 z-20 transition-colors ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">music_note</span>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>What Is Music?</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.exhibition[language]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-white/5 text-yellow-400' : 'bg-slate-100 text-slate-700'}`}>
            <span className="material-symbols-outlined text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>{t.backToMenu[language]}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className={`w-[440px] border-r p-10 flex flex-col gap-10 shadow-2xl z-10 transition-colors overflow-y-auto ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-200'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-black uppercase tracking-widest mb-4">Module 05</div>
            <h1 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>{language === 'EN' ? 'Harmony' : 'เสียงประสาน'}</h1>
            <p className="text-gray-500 mt-2">{language === 'EN' ? 'Multiple notes played together.' : 'เสียงโน้ตหลายตัวที่เล่นพร้อมกันจนเกิดเป็นเสียงเดียว'}</p>
          </div>
          <div className="space-y-6">
             <div className={`rounded-2xl p-6 border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">{t.harmonyName[language]}</span>
                <div className="flex items-center gap-3">
                   <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
                   <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>{getChordName()}</span>
                </div>
             </div>
             <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.tryCombinations[language]}</h3>
                <button onClick={() => setActiveNotes(['c3', 'e3', 'g3'])} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white hover:bg-primary/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-primary/5'}`}>
                   <span>C Major (C+E+G)</span>
                   <span className="material-symbols-outlined text-primary">auto_awesome</span>
                </button>
             </div>
          </div>
          <div className="mt-auto">
             <button onClick={() => setActiveNotes([])} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                <span className="material-symbols-outlined">restart_alt</span>
                {t.reset[language]}
             </button>
          </div>
        </aside>

        <section className={`flex-1 flex flex-col overflow-hidden stage-grid relative transition-colors ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-[#f6f8f8]'}`}>
           <div className="flex-1 flex items-center justify-center p-20 relative">
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                 {NOTES.map((note, i) => activeNotes.includes(note.id) && (
                    <div key={note.id} style={{ backgroundColor: note.color, transform: `translate(${(i - 4) * 35}px, ${(i % 2 === 0 ? 1 : -1) * 30}px)`, filter: 'blur(35px)', opacity: 0.8 }} className="absolute w-72 h-72 rounded-full blend-multiply animate-pulse" />
                 ))}
                 {activeNotes.length > 0 && <div className="absolute w-40 h-40 bg-white/40 blur-[50px] rounded-full animate-pulse shadow-inner" />}
              </div>
           </div>
           <div className={`w-full border-t p-10 z-20 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="max-w-5xl mx-auto flex gap-4 overflow-x-auto pb-4">
                 {NOTES.map((note) => (
                    <button key={note.id} onClick={() => { initAudio(); setActiveNotes(prev => prev.includes(note.id) ? prev.filter(n => n !== note.id) : [...prev, note.id]); }} className={`flex flex-col items-center gap-4 transition-all duration-500 min-w-[100px] ${activeNotes.includes(note.id) ? 'scale-110 -translate-y-2' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                        <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${note.grad} shadow-2xl flex items-center justify-center relative overflow-hidden group`}>
                            <span className="text-white font-black text-3xl drop-shadow-md">{note.name}</span>
                        </div>
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
