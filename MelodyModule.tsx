
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Point, Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface MelodyModuleProps {
  onBack: () => void;
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
}

const MelodyModule: React.FC<MelodyModuleProps> = ({ onBack, language, theme, toggleTheme }) => {
  const t = TRANSLATIONS;
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
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
        gainRef.current.gain.setTargetAtTime(0.2, audioCtxRef.current.currentTime, 0.05);
    }
  }, [playheadPoint, isPlaying]);

  return (
    <div className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-background-light'} overflow-hidden`}>
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

      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className={`flex w-full flex-col gap-6 border-r p-6 lg:w-[320px] lg:p-8 transition-colors ${theme === 'dark' ? 'bg-[#0a1118] border-white/5' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">Module 01</div>
            <h1 className={`text-4xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#0d191b]'}`}>
              {language === 'EN' ? 'Melody' : 'ทำนอง'}<br/>
              <span className="text-2xl font-bold opacity-30">{language === 'EN' ? 'Tune' : 'ทำนอง'}</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {language === 'EN' 
                ? 'Pitch moves up and down over time. Higher positions represent higher notes.' 
                : 'ระดับเสียงเคลื่อนที่ขึ้นและลงตามเวลา ตำแหน่งที่สูงขึ้นหมายถึงโน้ตที่สูงขึ้น'}
            </p>
          </div>
          <div className="h-px w-full bg-gray-100/10"></div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.showGuides[language]}</span>
              <label className="relative flex cursor-pointer items-center">
                <input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.playbackSpeed[language]}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-slate-700'}`}>{speed.toFixed(1)}x</span>
            </div>
            <input type="range" min="0.5" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>
        </aside>

        <section className={`relative flex-1 overflow-hidden stage-grid ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-[#f6f8f8]'}`}>
          <div className={`absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full p-1.5 shadow-xl ${theme === 'dark' ? 'bg-[#1a2b2e]' : 'bg-white'}`}>
            <button className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${!isPlaying ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10'}`}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button onClick={() => { setPoints([]); setIsPlaying(false); }} className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-red-500">
              <span className="material-symbols-outlined">delete</span>
            </button>
            <div className="mx-1 h-6 w-px bg-gray-200/20"></div>
            <button onClick={() => { initAudio(); setIsPlaying(!isPlaying); }} className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-primary text-white' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
          </div>

          <div className="relative flex h-full w-full items-center justify-center">
            <svg ref={canvasRef} viewBox="0 0 1000 400" className="h-[80%] w-[90%] overflow-visible cursor-crosshair touch-none" onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
              {showGuides && (
                <g className={`${theme === 'dark' ? 'text-white/5' : 'text-slate-200'}`} stroke="currentColor" strokeDasharray="4 4">
                  <line x1="0" y1="50" x2="1000" y2="50" />
                  <line x1="0" y1="200" x2="1000" y2="200" />
                  <line x1="0" y1="350" x2="1000" y2="350" />
                </g>
              )}
              {pathD && (
                <>
                  <path d={pathD} fill="none" stroke="rgba(19, 200, 236, 0.2)" strokeWidth="12" strokeLinecap="round" />
                  <path d={pathD} fill="none" stroke="#13c8ec" strokeWidth="6" strokeLinecap="round" className="drop-shadow-lg" />
                  {isPlaying && playheadPoint.x !== -100 && (
                    <circle cx={playheadPoint.x} cy={playheadPoint.y} r="10" fill="white" stroke="#13c8ec" strokeWidth="4" className="shadow-lg" />
                  )}
                </>
              )}
              {!isDrawing && points.length === 0 && (
                <text x="500" y="200" textAnchor="middle" className="fill-primary font-bold animate-pulse pointer-events-none opacity-50 text-3xl">
                  {t.drawMelody[language]}
                </text>
              )}
            </svg>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MelodyModule;
