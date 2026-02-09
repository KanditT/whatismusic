
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface DynamicsModuleProps {
  onBack: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const DynamicsModule: React.FC<DynamicsModuleProps> = ({ onBack, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [volume, setVolume] = useState(70);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      filterRef.current = audioCtxRef.current.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.Q.value = 5;
      gainRef.current = audioCtxRef.current.createGain();
      oscRef.current = audioCtxRef.current.createOscillator();
      oscRef.current.type = 'sawtooth';
      oscRef.current.frequency.setValueAtTime(110, audioCtxRef.current.currentTime);
      oscRef.current.connect(filterRef.current);
      filterRef.current.connect(gainRef.current);
      gainRef.current.connect(audioCtxRef.current.destination);
      oscRef.current.start();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  };

  useEffect(() => {
    if (gainRef.current && filterRef.current && audioCtxRef.current) {
        const v = volume / 100;
        gainRef.current.gain.setTargetAtTime(v * 0.3, audioCtxRef.current.currentTime, 0.05);
        filterRef.current.frequency.setTargetAtTime(200 + (v * 2000), audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
        if (oscRef.current) oscRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const handleSliderInteraction = (clientY: number) => {
    if (!sliderRef.current) return;
    initAudio();
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = 1 - (clientY - rect.top) / rect.height;
    const val = Math.max(0, Math.min(100, pos * 100));
    setVolume(val);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    handleSliderInteraction(e.clientY);
    const moveHandler = (mE: MouseEvent) => handleSliderInteraction(mE.clientY);
    const upHandler = () => { window.removeEventListener('mousemove', moveHandler); window.removeEventListener('mouseup', upHandler); };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

  const getIntensityLabel = () => {
    if (volume < 20) return 'Piano';
    if (volume < 50) return 'Mezzo';
    if (volume < 85) return 'Forte';
    return 'Fortissimo';
  };

  const intensity = getIntensityLabel();
  const starScale = 0.4 + (volume / 100) * 0.8;

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

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className={`w-full lg:w-[400px] border-r p-10 flex flex-col gap-8 shadow-2xl z-10 transition-colors ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-200'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-black uppercase tracking-widest mb-4">Module 03</div>
            <h1 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>{language === 'EN' ? 'Dynamics' : 'ความดัง-เบา'}</h1>
            <p className="text-gray-500 mt-2">{language === 'EN' ? 'Variation in loudness.' : 'ความแปรผันของความดังระหว่างโน้ต'}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-10 gap-12">
            <div className="flex flex-1 w-full justify-center gap-12 items-center">
               <div className={`flex flex-col justify-between h-[300px] text-2xl font-black italic transition-opacity ${theme === 'dark' ? 'text-white/20' : 'text-slate-200'}`}>
                  <span className={volume >= 85 ? 'text-primary opacity-100' : ''}>ff</span>
                  <span className={volume >= 50 && volume < 85 ? 'text-primary opacity-100' : ''}>f</span>
                  <span className={volume >= 20 && volume < 50 ? 'text-primary opacity-100' : ''}>mf</span>
                  <span className={volume < 20 ? 'text-primary opacity-100' : ''}>p</span>
               </div>
               <div ref={sliderRef} onMouseDown={onMouseDown} onTouchMove={(e) => handleSliderInteraction(e.touches[0].clientY)} className={`relative h-[300px] w-24 rounded-[2rem] border-4 cursor-pointer overflow-hidden group shadow-inner transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-75" style={{ height: `${volume}%` }}></div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-75 pointer-events-none" style={{ bottom: `calc(${volume}% - 24px)` }}>
                     <div className="size-12 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-primary"><span className="material-symbols-outlined text-primary text-xl">drag_handle</span></div>
                  </div>
               </div>
            </div>
          </div>
          <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
             <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">{t.volume[language]}</p>
             <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-primary">{intensity}</span>
                <span className={`text-xs font-black px-4 py-2 rounded-full border shadow-sm ${theme === 'dark' ? 'bg-white/10 text-white border-white/10' : 'bg-white text-slate-700'}`}>{Math.round(volume)}%</span>
             </div>
          </div>
        </aside>

        <section className={`flex-1 flex flex-col items-center justify-center stage-grid relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-[#f6f8f8]'}`}>
          <div style={{ transform: `scale(${starScale}) rotate(${volume}deg)`, transition: 'transform 0.1s ease-out' }} className="relative">
            <div className="absolute inset-0 bg-primary blur-[80px] rounded-full opacity-30 animate-pulse" style={{ transform: `scale(${1 + volume/100})` }}></div>
            <svg width="400" height="400" viewBox="0 0 100 100" className="fill-primary drop-shadow-2xl relative z-10">
              <path d="M50 5 L63 40 L98 40 L70 62 L80 95 L50 75 L20 95 L30 62 L2 40 L37 40 Z" />
            </svg>
          </div>
          <div className={`absolute bottom-10 px-10 py-5 rounded-3xl border shadow-2xl flex flex-col items-center gap-1 text-center max-w-sm transition-colors ${theme === 'dark' ? 'bg-[#1a2b2e]/80 border-white/5 text-white' : 'bg-white/80 border-slate-100 text-slate-700'}`}>
             <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{t.visualImpact[language]}</span>
             <p className="text-sm font-medium opacity-60 italic leading-relaxed">
               {language === 'EN' ? 'Size and vibrancy react to sound energy.' : 'ขนาดและความสดใสตอบสนองต่อพลังงานของเสียง'}
             </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DynamicsModule;
