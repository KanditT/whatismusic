
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Language, Theme, ModuleId } from '../types';
import { TRANSLATIONS, MODULES } from '../constants';
import GuideModal from './GuideModal';

interface RhythmModuleProps {
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
  globalVolume: number;
}

const RhythmModule: React.FC<RhythmModuleProps> = ({ onBack, onNext, onPrevious, language, theme, toggleTheme, globalVolume }) => {
  const t = TRANSLATIONS;
  const [grid, setGrid] = useState<boolean[][]>(Array(4).fill(null).map(() => Array(4).fill(false)));
  const [tempo, setTempo] = useState(120);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(true);

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
    const vol = globalVolume / 100;

    switch(row) {
      case 0: // Kick
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
        gain.gain.setValueAtTime(1 * vol, now);
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
        noiseGain.gain.setValueAtTime(0.3 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        noise.start(now);
        noise.stop(now + 0.1);
        break;
      case 2: // Tom
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.5 * vol, now);
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
        hhGain.gain.setValueAtTime(0.05 * vol, now);
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
          <button onClick={onBack} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all text-lg ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="hidden sm:inline">{t.backToMenu[language]}</span>
          </button>
          <div className="hidden sm:flex size-12 rounded-full bg-primary/10 text-primary items-center justify-center">
            <span className="material-symbols-outlined text-2xl">music_note</span>
          </div>
          <div className="hidden md:block">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>What Is Music?</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t.exhibition[language]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowGuideModal(true)} 
            className={`flex items-center justify-center size-12 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-[#251848] text-[#FFDE59] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
          >
            <span className="material-symbols-outlined text-base">help</span>
          </button>

          <button onClick={onPrevious} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all text-lg ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined text-xl">chevron_left</span>
            <span className="hidden sm:inline">{t.prevModule[language]}</span>
          </button>
          
          <button onClick={onNext} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all text-lg ${theme === 'dark' ? 'bg-[#251848] text-[#E8DCFF] hover:bg-[#251848]/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <span className="hidden sm:inline">{t.nextModule[language]}</span>
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className={`w-full lg:w-[500px] border-r p-12 flex flex-col gap-10 shadow-2xl z-10 transition-colors overflow-y-auto ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-base font-black uppercase tracking-widest mb-3">
              Module 02
            </div>
            <h1 className={`text-6xl md:text-7xl font-black ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>
              {language === 'EN' ? 'Rhythm' : 'จังหวะ'} <span className="text-3xl font-bold opacity-30">(จังหวะ)</span>
            </h1>
            <p className={`text-xl font-medium mt-2 ${theme === 'dark' ? 'text-[#9B7EC8]' : 'text-primary'}`}>
              {language === 'EN' ? 'Design a looping pattern.' : 'ออกแบบลวดลายจังหวะแบบวนซ้ำ'}
            </p>
          </div>
          
          <div className="flex flex-col gap-10 mt-2">
            <button onClick={() => { initAudio(); setIsPlaying(!isPlaying); }} className={`group flex items-center justify-center gap-4 px-12 py-6 rounded-[2rem] font-black text-2xl transition-all shadow-xl active:scale-95 w-full ${isPlaying ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-primary text-white shadow-primary/30'}`}>
              <span className="material-symbols-outlined text-4xl">{isPlaying ? 'pause_circle' : 'play_circle'}</span>
              {isPlaying ? t.stopLoop[language] : t.playLoop[language]}
            </button>

            <div className="flex flex-col justify-center gap-6">
              <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-[#0F0A1A] border-[#251848]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className={`font-bold text-xl flex items-center gap-3 ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>
                     <span className="material-symbols-outlined text-3xl text-primary">speed</span>
                     Tempo: <span className="text-primary">{tempo} BPM</span>
                   </h3>
                </div>
                <input type="range" min="60" max="200" value={tempo} onChange={(e) => setTempo(parseInt(e.target.value))} className="w-full h-4 bg-yellow-300/80 rounded-full accent-primary appearance-none cursor-pointer border border-white/10" />
              </div>
              <button onClick={() => setGrid(Array(4).fill(null).map(() => Array(4).fill(false)))} className={`w-full py-5 rounded-2xl font-bold transition-all text-xl flex items-center justify-center gap-3 ${theme === 'dark' ? 'bg-[#251848] text-[#9B7EC8] hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                <span className="material-symbols-outlined text-2xl">delete_sweep</span>
                {t.clear[language]}
              </button>
            </div>
          </div>
        </aside>

        <section className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-background-light'} stage-grid p-8`}>
           <div className={`w-full max-w-4xl p-10 md:p-16 rounded-[3rem] shadow-2xl border transition-colors ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-primary/10'}`}>
              <div className="flex justify-center items-center">
                <div className="flex w-full gap-6">
                  <div className="flex flex-col justify-end pb-6 pt-12 text-right pr-4">
                    <div className={`flex flex-col items-end gap-1 flex-1 justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-3xl">radio_button_checked</span>
                      <span className="text-sm uppercase font-black tracking-wider">Kick</span>
                    </div>
                    <div className={`flex flex-col items-end gap-1 flex-1 justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-3xl">blur_on</span>
                      <span className="text-sm uppercase font-black tracking-wider">Snare</span>
                    </div>
                    <div className={`flex flex-col items-end gap-1 flex-1 justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-3xl">adjust</span>
                      <span className="text-sm uppercase font-black tracking-wider">Tom</span>
                    </div>
                    <div className={`flex flex-col items-end gap-1 flex-1 justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-3xl">lens_blur</span>
                      <span className="text-sm uppercase font-black tracking-wider">Hi-hat</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    {/* Column Labels */}
                    <div className="grid grid-cols-4 gap-8 px-8 pb-4 text-center">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className={`font-black text-2xl ${theme === 'dark' ? 'text-[#9B7EC8]' : 'text-primary'}`}>
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* Grid */}
                    <div className={`flex-1 grid grid-cols-4 gap-8 aspect-square relative p-8 rounded-[3rem] ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-slate-50'}`}>
                    <div className="absolute top-0 bottom-0 w-3 bg-primary/30 z-20 transition-all duration-200 ease-linear shadow-[0_0_20px_#9B5FE3] rounded-full" style={{ left: `${(activeStep / 4) * 100 + 12.5}%`, transform: 'translateX(-50%)' }}></div>
                    {grid.map((row, r) => row.map((cell, c) => (
                      <button key={`${r}-${c}`} onClick={() => toggleCell(r, c)} className={`aspect-square rounded-[1.5rem] relative transition-all duration-300 ${cell ? 'bg-primary shadow-[0_0_25px_#9B5FE3] scale-105' : theme === 'dark' ? 'bg-[#251848] border-2 border-[#251848]' : 'bg-white hover:bg-gray-100 border-2 border-gray-100'}`}>
                        {!cell && <div className={`absolute inset-0 m-auto size-3 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>}
                        {cell && activeStep === c && isPlaying && <div className="absolute inset-0 rounded-[1.5rem] border-4 border-white ripple-effect"></div>}
                      </button>
                    )))}
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </section>
      </main>

      <GuideModal 
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title={MODULES.find(m => m.id === ModuleId.RHYTHM)!.guide.title}
        instructions={MODULES.find(m => m.id === ModuleId.RHYTHM)!.guide.instructions}
        language={language}
        theme={theme}
      />
    </div>
  );
};

export default RhythmModule;
