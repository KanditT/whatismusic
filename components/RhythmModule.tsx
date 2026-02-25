
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface RhythmModuleProps {
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const RhythmModule: React.FC<RhythmModuleProps> = ({ onBack, onNext, onPrevious, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [grid, setGrid] = useState<boolean[][]>(Array(4).fill(null).map(() => Array(4).fill(false)));
  const [tempo, setTempo] = useState(120);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  };

  const playPercussion = (row: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    switch(row) {
      case 0: // Kick
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 1: // Snare
        const noise = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        noise.start(now);
        noise.stop(now + 0.1);
        break;
      case 2: // Tom
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 3: // Hi-hat
        const hhOsc = ctx.createOscillator();
        const hhGain = ctx.createGain();
        hhOsc.type = 'square';
        hhOsc.frequency.setValueAtTime(10000, now);
        hhOsc.connect(hhGain);
        hhGain.connect(ctx.destination);
        hhGain.gain.setValueAtTime(0.05, now);
        hhGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        hhOsc.start(now);
        hhOsc.stop(now + 0.05);
        break;
    }
  };

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      const msPerStep = (60 / tempo) * 1000 / 4;
      interval = window.setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % 4;
          grid.forEach((row, rowIndex) => {
            if (row[next]) playPercussion(rowIndex);
          });
          return next;
        });
      }, msPerStep * 4);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tempo, grid]);

  const toggleCell = (r: number, c: number) => {
    initAudio();
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
    if (newGrid[r][c]) playPercussion(r);
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

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
            <div className="relative z-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-wide text-primary mb-2">
                Module 02
               
              </div>
              <h1 className={`text-5xl font-black ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>
                {language === 'EN' ? 'Rhythm' : 'จังหวะ'} <span className="text-2xl font-bold opacity-30">(จังหวะ)</span>
              </h1>
              <p className={`text-lg font-medium mt-1 ${theme === 'dark' ? 'text-[#9B7EC8]' : 'text-primary'}`}>
                {language === 'EN' ? 'Design a looping pattern.' : 'ออกแบบลวดลายจังหวะแบบวนซ้ำ'}
              </p>
            </div>
            <button onClick={() => { initAudio(); setIsPlaying(!isPlaying); }} className={`group flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 ${isPlaying ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-primary text-white shadow-primary/30'}`}>
              <span className="material-symbols-outlined text-3xl">{isPlaying ? 'pause_circle' : 'play_circle'}</span>
              {isPlaying ? t.stopLoop[language] : t.playLoop[language]}
            </button>
          </div>

          <div className={`rounded-[3rem] shadow-2xl border p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
            <div className="flex justify-center items-center">
              <div className={`grid grid-cols-4 gap-4 w-full max-w-[480px] aspect-square relative p-6 rounded-[2rem] ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-slate-50'}`}>
                <div className="absolute top-0 bottom-0 w-2 bg-primary/30 z-20 transition-all duration-200 ease-linear shadow-[0_0_20px_#9B5FE3] rounded-full" style={{ left: `${(activeStep / 4) * 100 + 12.5}%`, transform: 'translateX(-50%)' }}></div>
                {grid.map((row, r) => row.map((cell, c) => (
                  <button key={`${r}-${c}`} onClick={() => toggleCell(r, c)} className={`aspect-square rounded-2xl relative transition-all duration-300 ${cell ? 'bg-primary shadow-[0_0_25px_#9B5FE3] scale-105' : theme === 'dark' ? 'bg-[#251848] border-2 border-[#251848]' : 'bg-white hover:bg-gray-100 border-2 border-gray-100'}`}>
                    {!cell && <div className={`absolute inset-0 m-auto size-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>}
                    {cell && activeStep === c && isPlaying && <div className="absolute inset-0 rounded-2xl border-4 border-white ripple-effect"></div>}
                  </button>
                )))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-8">
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-[#0F0A1A] border-[#251848]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>
                     <span className="material-symbols-outlined text-primary">speed</span>
                     Tempo: <span className="text-primary">{tempo} BPM</span>
                   </h3>
                </div>
                <input type="range" min="60" max="200" value={tempo} onChange={(e) => setTempo(parseInt(e.target.value))} className="w-full h-3 bg-yellow-300/80 rounded-full accent-primary appearance-none cursor-pointer border border-white/10" />
              </div>
              <button onClick={() => setGrid(Array(4).fill(null).map(() => Array(4).fill(false)))} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-[#251848] text-[#9B7EC8] hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                <span className="material-symbols-outlined">delete_sweep</span>
                {t.clear[language]}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RhythmModule;
