
import React, { useState, useEffect, useRef } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface TempoModuleProps {
  onBack: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const TempoModule: React.FC<TempoModuleProps> = ({ onBack, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [bpm, setBpm] = useState(120);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTick = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const intervalTime = (60 / bpm) * 1000;
    const interval = setInterval(() => {
      playTick();
    }, intervalTime);
    return () => clearInterval(interval);
  }, [bpm]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const getTempoLabel = () => {
    if (bpm < 60) return { name: 'Largo', desc: { EN: 'Slow and broad.', TH: 'ช้าและกว้าง' } };
    if (bpm < 108) return { name: 'Andante', desc: { EN: 'A walking pace.', TH: 'จังหวะการเดิน' } };
    return { name: 'Allegro', desc: { EN: 'Fast, quickly and bright.', TH: 'เร็ว รวดเร็ว และสดใส' } };
  };

  const label = getTempoLabel();
  const animationSpeed = (60 / bpm).toFixed(2) + 's';

  return (
    <div onMouseDown={initAudio} onTouchStart={initAudio} className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-background-light'} overflow-hidden font-display`}>
      {/* Standardized Header */}
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
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <span className="material-symbols-outlined text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>{t.backToMenu[language]}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <h1 className={`text-6xl font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>
              {language === 'EN' ? 'Tempo' : 'ความเร็ว'} 
              <span className={`text-3xl font-bold text-primary opacity-60 ml-4`}>
                ({language === 'EN' ? 'Tempo' : 'ความเร็ว'})
              </span>
            </h1>
            <p className={`text-xl max-w-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t.tempoDesc[language]}
            </p>
          </div>

          <div className={`flex-1 rounded-3xl border shadow-inner overflow-hidden relative group transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="absolute inset-0 flex items-center justify-center gap-12 lg:gap-20">
              <div 
                style={{ animationDuration: animationSpeed }}
                className="w-24 h-24 lg:w-32 lg:h-32 bg-primary rounded-2xl shadow-xl shadow-primary/20 animate-bounce flex items-center justify-center"
              >
                <div className="w-8 h-8 border-4 border-white/50 rounded-full"></div>
              </div>
              
              <div 
                style={{ animationDuration: animationSpeed, animationDelay: '0.1s' }}
                className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-tr from-primary to-cyan-300 rounded-full shadow-2xl shadow-primary/30 animate-pulse flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-white text-6xl">graphic_eq</span>
              </div>

              <div 
                style={{ animationDuration: animationSpeed, animationDelay: '0.2s' }}
                className={`w-20 h-20 lg:w-28 lg:h-28 rounded-xl shadow-lg animate-bounce flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-[#101f22]'}`}
              >
                 <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[18px] border-t-primary border-r-[10px] border-r-transparent"></div>
              </div>
            </div>

            <div className={`absolute top-6 right-6 flex items-center gap-3 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200'}`}>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className={`font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{bpm} BPM</span>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
               {language === 'EN' ? 'Current Mode:' : 'โหมดปัจจุบัน:'} <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>{label.name}</span> — {label.desc[language]}
            </p>
          </div>
        </div>

        <div className={`w-full lg:w-[440px] border-l p-10 flex flex-col justify-center gap-12 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="text-center space-y-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.currentTempo[language]}</span>
            <div className={`text-8xl font-black tracking-tighter tabular-nums leading-none ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>
              {bpm} <span className="text-2xl text-gray-300 font-bold align-top mt-4 inline-block">BPM</span>
            </div>
          </div>

          <div className="space-y-12">
            <div className="relative">
                <div className="absolute -top-6 left-0 w-full flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>{language === 'EN' ? 'Slow' : 'ช้า'}</span>
                    <span>{language === 'EN' ? 'Fast' : 'เร็ว'}</span>
                </div>
                <input 
                    type="range" min="40" max="220" value={bpm} 
                    onChange={(e) => { initAudio(); setBpm(parseInt(e.target.value)); }}
                    className="w-full h-4 bg-gray-100 dark:bg-white/10 rounded-full accent-primary appearance-none cursor-pointer"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Largo', icon: 'hiking', range: '40-60', val: 50 },
                { name: 'Andante', icon: 'directions_walk', range: '76-108', val: 92 },
                { name: 'Allegro', icon: 'directions_run', range: '120-168', val: 144 }
              ].map(item => (
                <button 
                    key={item.name}
                    onClick={() => { initAudio(); setBpm(item.val); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${label.name === item.name ? 'bg-primary/10 ring-2 ring-primary' : theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                >
                  <span className={`material-symbols-outlined text-4xl ${label.name === item.name ? 'text-primary' : 'text-gray-300'}`}>{item.icon}</span>
                  <span className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.name}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{item.range}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <h3 className={`font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              {t.didYouKnow[language]}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              {t.italianTerms[language]}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TempoModule;
