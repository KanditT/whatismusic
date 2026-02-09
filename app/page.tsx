
"use client";

import React, { useState, useEffect } from 'react';
import { ModuleId, Language, Theme } from '../types';
import ModuleMenu from '../components/ModuleMenu';
import MelodyModule from '../components/MelodyModule';
import RhythmModule from '../components/RhythmModule';
import TempoModule from '../components/TempoModule';
import DynamicsModule from '../components/DynamicsModule';
import HarmonyModule from '../components/HarmonyModule';

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.MENU);
  const [language, setLanguage] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const sharedProps = {
    onBack: () => setActiveModule(ModuleId.MENU),
    language,
    theme,
    toggleTheme
  };

  const renderModule = () => {
    switch (activeModule) {
      case ModuleId.MELODY:
        return <MelodyModule {...sharedProps} />;
      case ModuleId.RHYTHM:
        return <RhythmModule {...sharedProps} />;
      case ModuleId.TEMPO:
        return <TempoModule {...sharedProps} />;
      case ModuleId.DYNAMICS:
        return <DynamicsModule {...sharedProps} />;
      case ModuleId.HARMONY:
        return <HarmonyModule {...sharedProps} />;
      default:
        return (
          <ModuleMenu 
            onSelectModule={setActiveModule} 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-background-light'}`}>
      {renderModule()}
    </div>
  );
}
