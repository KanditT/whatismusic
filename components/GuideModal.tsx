import React, { useEffect } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: Record<Language, string>;
  instructions: Record<Language, string[]>;
  language: Language;
  theme: Theme;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, title, instructions, language, theme }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-lg rounded-[2rem] p-8 shadow-2xl transition-all scale-100 ${theme === 'dark' ? 'bg-[#1A1030] border border-[#251848] text-[#E8DCFF]' : 'bg-white border border-gray-100 text-[#1A1A1A]'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
             </div>
             <h2 className="text-3xl font-black">{title[language]}</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {instructions[language].map((step, idx) => (
            <div key={idx} className="flex gap-4">
               <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-black text-sm">
                  {idx + 1}
               </div>
               <p className={`text-lg font-medium leading-relaxed pt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {step}
               </p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 rounded-xl font-black tracking-wide bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
        >
          {TRANSLATIONS.gotIt[language]}
        </button>
      </div>
    </div>
  );
};

export default GuideModal;
