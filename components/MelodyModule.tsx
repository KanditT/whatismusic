
"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Point, Language, Theme, ModuleId } from '../types';
import { TRANSLATIONS, MODULES } from '../constants';
import GuideModal from './GuideModal';

interface MelodyModuleProps {
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
  globalVolume: number;
}

const MelodyModule: React.FC<MelodyModuleProps> = ({ onBack, onNext, onPrevious, language, theme, toggleTheme, globalVolume }) => {
  const t = TRANSLATIONS;
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(true);
  const [speed, setSpeed] = useState(1);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [playhead, setPlayhead] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.connect(audioCtxRef.current.destination);
      gainRef.current.gain.value = 0;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) oscRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isPlaying && points.length > 0) {
      initAudio();
      if (!oscRef.current && audioCtxRef.current && gainRef.current) {
        oscRef.current = audioCtxRef.current.createOscillator();
        oscRef.current.type = 'sine';
        oscRef.current.connect(gainRef.current);
        oscRef.current.start();
      }
      interval = window.setInterval(() => {
        setPlayhead((prev) => (prev >= 1 ? 0 : prev + 0.005 * speed));
      }, 16);
    } else {
      if (gainRef.current) gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.05);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, points.length]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    initAudio();
    setIsDrawing(true);
    setPoints([]);
    setIsPlaying(false);
    setPlayhead(0);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const relX = ((x - rect.left) / rect.width) * 1000;
    const relY = ((y - rect.top) / rect.height) * 400;
    setPoints((prev) => [...prev, { x: relX, y: relY }]);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (points.length > 2) setIsPlaying(true);
  };

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const getPlayheadPos = useCallback(() => {
    if (points.length < 2) return { x: -100, y: -100 };
    const minX = points[0].x;
    const maxX = points[points.length - 1].x;
    const rangeX = maxX - minX;
    const targetX = minX + (playhead * rangeX);
    let p1 = points[0];
    let p2 = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
        if (points[i].x <= targetX && points[i+1].x >= targetX) {
            p1 = points[i];
            p2 = points[i+1];
            break;
        }
    }
    const t = (targetX - p1.x) / (p2.x - p1.x || 1);
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }, [points, playhead]);

  const playheadPoint = getPlayheadPos();

  useEffect(() => {
    if (isPlaying && oscRef.current && audioCtxRef.current && gainRef.current && playheadPoint.y !== -100) {
        const freq = 880 - (playheadPoint.y / 400) * (880 - 110);
        oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.05);
        gainRef.current.gain.setTargetAtTime(0.2 * (globalVolume / 100), audioCtxRef.current.currentTime, 0.05);
    }
  }, [playheadPoint, isPlaying, globalVolume]);

  return (
    <div className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-background-light'} overflow-hidden`}>
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

      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className={`flex w-full flex-col gap-8 border-r p-8 lg:w-[480px] lg:p-12 transition-colors overflow-y-auto ${theme === 'dark' ? 'bg-[#0F0A1A] border-[#251848]' : 'bg-white border-primary/10'}`}>
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-primary">Module 01</div>
            <h1 className={`text-6xl md:text-7xl font-black tracking-tight ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>
              {language === 'EN' ? 'Melody' : 'ทำนอง'}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mt-2 leading-relaxed">
              {language === 'EN' 
                ? 'Pitch moves up and down over time. Higher positions represent higher notes.' 
                : 'ระดับเสียงเคลื่อนที่ขึ้นและลงตามเวลา ตำแหน่งที่สูงขึ้นหมายถึงโน้ตที่สูงขึ้น'}
            </p>
          </div>
          <div className="h-px w-full bg-gray-100/10"></div>
          
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-primary/5 border-primary/10'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>{t.showGuides[language]}</span>
              <label className="relative flex cursor-pointer items-center">
                <input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} className="peer sr-only" />
                <div className="h-7 w-12 rounded-full bg-gray-200 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-primary/5 border-primary/10'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-[#E8DCFF]' : 'text-[#1A1A1A]'}`}>{t.playbackSpeed[language]}</span>
              <span className={`rounded-lg px-3 py-1 text-base font-bold ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-slate-700'}`}>{speed.toFixed(1)}x</span>
            </div>
            <input type="range" min="0.5" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full h-3 rounded-full cursor-pointer accent-primary" />
          </div>
        </aside>

        <section className={`relative flex-1 overflow-hidden stage-grid ${theme === 'dark' ? 'bg-[#0F0A1A]' : 'bg-background-light'}`}>
          <div className={`absolute left-1/2 top-8 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full p-2 shadow-2xl border ${theme === 'dark' ? 'bg-[#1A1030] border-[#251848]' : 'bg-white border-gray-100'}`}>
            <button className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${!isPlaying ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100/10'}`}>
              <span className="material-symbols-outlined text-2xl">edit</span>
            </button>
            <button onClick={() => { setPoints([]); setIsPlaying(false); }} className="flex h-14 w-14 items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100/10 transition-colors">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </button>
            <div className="mx-2 h-8 w-px bg-gray-200/20"></div>
            <button onClick={() => { initAudio(); setIsPlaying(!isPlaying); }} className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100/10'}`}>
              <span className="material-symbols-outlined text-3xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
          </div>

          <div className="relative flex h-full w-full items-center justify-center">
            <svg ref={canvasRef} viewBox="0 0 1000 400" className="h-[80%] w-[90%] overflow-visible cursor-crosshair touch-none" onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
              {showGuides && (
                <g className={`${theme === 'dark' ? 'text-white/5' : 'text-primary/30'}`} stroke="currentColor" strokeDasharray="4 4">
                  <line x1="0" y1="50" x2="1000" y2="50" />
                  <line x1="0" y1="200" x2="1000" y2="200" />
                  <line x1="0" y1="350" x2="1000" y2="350" />
                </g>
              )}
              {pathD && (
                <>
                  <path d={pathD} fill="none" stroke="rgba(155, 95, 227, 0.2)" strokeWidth="12" strokeLinecap="round" />
                  <path d={pathD} fill="none" stroke="#F5CE30" strokeWidth="8" strokeLinecap="round" className="drop-shadow-lg" />
                  {isPlaying && playheadPoint.x !== -100 && (
                    <circle cx={playheadPoint.x} cy={playheadPoint.y} r="12" fill="white" stroke="#9B5FE3" strokeWidth="6" className="shadow-2xl" />
                  )}
                </>
              )}
              {!isDrawing && points.length === 0 && (
                <text x="500" y="200" textAnchor="middle" className="fill-primary font-bold animate-pulse pointer-events-none opacity-40 text-4xl">
                  {t.drawMelody[language]}
                </text>
              )}
            </svg>
          </div>
        </section>
      </main>

      <GuideModal 
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title={MODULES.find(m => m.id === ModuleId.MELODY)!.guide.title}
        instructions={MODULES.find(m => m.id === ModuleId.MELODY)!.guide.instructions}
        language={language}
        theme={theme}
      />
    </div>
  );
};

export default MelodyModule;
