
"use client";
import React from 'react';
import { ModuleId, Language, Theme } from '../types';
import { MODULES, TRANSLATIONS } from '../constants';

interface ModuleMenuProps {
  onSelectModule: (id: ModuleId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const ModuleMenu: React.FC<ModuleMenuProps> = ({ onSelectModule, language, setLanguage, theme, toggleTheme }) => {
  const t = TRANSLATIONS;

  return (
    <div className={`flex min-h-screen items-center justify-center p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-[#f6f8f8]'} relative overflow-hidden`}>
      {/* Background Decorative Elements */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${theme === 'dark' ? 'bg-primary/10' : 'bg-primary/20'}`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/20'}`} style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-7xl relative z-10">
        <header className="mb-16 flex flex-col items-center text-center gap-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-[0.3em] backdrop-blur-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-primary' : 'bg-primary/5 border-primary/20 text-primary'}`}>
            {t.exhibition[language]}
          </div>
          
          <div className="space-y-2">
            <h1 className={`text-6xl md:text-8xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              What Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">Music?</span>
            </h1>
            <p className={`text-2xl font-bold opacity-30 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>(ดนตรีคืออะไร?)</p>
          </div>

          <div className="flex gap-4">
            <div className={`flex overflow-hidden rounded-full p-1 border backdrop-blur-md ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-8 py-2 text-sm font-black transition-all rounded-full ${language === 'EN' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-500 hover:text-primary'}`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => setLanguage('TH')}
                className={`px-8 py-2 text-sm font-black transition-all rounded-full ${language === 'TH' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-500 hover:text-primary'}`}
              >
                ภาษาไทย
              </button>
            </div>

            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`group relative flex flex-col items-center justify-between rounded-[2.5rem] border p-10 text-center transition-all hover:border-primary/50 hover:-translate-y-2 active:scale-95 backdrop-blur-xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div 
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                style={{ backgroundColor: `${module.color}20`, color: module.color, boxShadow: `0 20px 40px -10px ${module.color}40` }}
              >
                <span className="material-symbols-outlined text-5xl">{module.icon}</span>
              </div>

              <div className="relative z-10">
                <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{module.title[language]}</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{module.subtitle[language]}</p>
              </div>

              <div className="absolute -bottom-4 -right-4 opacity-[0.05] transition-all group-hover:opacity-[0.15] group-hover:scale-125">
                <span className="material-symbols-outlined text-[160px]">{module.icon}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-8">
          <button 
             onClick={() => onSelectModule(ModuleId.MELODY)}
             className="group flex items-center gap-4 rounded-full bg-primary px-12 py-6 text-xl font-black tracking-widest text-white shadow-[0_20px_50px_rgba(19,200,236,0.4)] transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl group-hover:animate-bounce">touch_app</span>
            {t.startExhibition[language]}
          </button>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>© National Sound Museum 2024</p>
        </div>
      </div>
    </div>
  );
};

export default ModuleMenu;
