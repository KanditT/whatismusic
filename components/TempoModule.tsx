
"use client";
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
  const [isTickEnabled, setIsTickEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTick = () => {
    if (!audioCtxRef.current || !isTickEnabled) return; 
    const ctx = audioCtxRef.current;
    if (ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
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
  }, [bpm, isTickEnabled]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (voiceSourceRef.current) voiceSourceRef.current.stop();
    };
  }, []);

  // Sync voice playback rate with BPM
  useEffect(() => {
    if (voiceSourceRef.current) {
      voiceSourceRef.current.playbackRate.value = bpm / 120;
    }
  }, [bpm]);

  const startRecording = async () => {
    initAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        if (audioCtxRef.current) {
          const buffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
          setRecordedBuffer(buffer);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(language === 'EN' ? "Microphone access denied." : "ไม่สามารถเข้าถึงไมโครโฟนได้");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleVoicePlayback = () => {
    if (isVoicePlaying) {
      if (voiceSourceRef.current) {
        voiceSourceRef.current.stop();
        voiceSourceRef.current = null;
      }
      setIsVoicePlaying(false);
    } else if (recordedBuffer && audioCtxRef.current) {
      initAudio();
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = recordedBuffer;
      source.loop = true;
      source.playbackRate.value = bpm / 120; // Base speed at 120 BPM
      source.connect(audioCtxRef.current.destination);
      source.start(0);
      voiceSourceRef.current = source;
      setIsVoicePlaying(true);
    }
  };

  const getTempoLabel = () => {
    if (bpm < 60) return { name: 'Largo', desc: { EN: 'Slow and broad.', TH: 'ช้าและกว้าง' } };
    if (bpm < 108) return { name: 'Andante', desc: { EN: 'A walking pace.', TH: 'จังหวะการเดิน' } };
    return { name: 'Allegro', desc: { EN: 'Fast, quickly and bright.', TH: 'เร็ว รวดเร็ว และสดใส' } };
  };

  const label = getTempoLabel();
  const animationSpeed = (60 / bpm).toFixed(2) + 's';

  return (
    <div onMouseDown={initAudio} onTouchStart={initAudio} className={`flex h-screen w-full flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a1118]' : 'bg-background-light'} overflow-hidden font-display`}>
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

          <div className={`flex-1 min-h-[300px] rounded-3xl border shadow-inner overflow-hidden relative group transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="absolute inset-0 flex items-center justify-center gap-12 lg:gap-20">
              <div 
                style={{ animationDuration: animationSpeed }}
                className="w-24 h-24 lg:w-32 lg:h-32 bg-primary rounded-2xl shadow-xl shadow-primary/20 animate-bounce flex items-center justify-center"
              >
                <div className="w-8 h-8 border-4 border-white/50 rounded-full"></div>
              </div>
              
              <div 
                style={{ animationDuration: animationSpeed, animationDelay: '0.1s' }}
                className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full shadow-2xl animate-pulse flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 shadow-red-500/30 scale-110' : 'bg-gradient-to-tr from-primary to-cyan-300 shadow-primary/30'}`}
              >
                <span className="material-symbols-outlined text-white text-6xl">
                  {isRecording ? 'mic' : isVoicePlaying ? 'spatial_audio_off' : 'graphic_eq'}
                </span>
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
                <span className={`animate-ping absolute inset-0 rounded-full opacity-75 ${isRecording ? 'bg-red-500' : (isTickEnabled ? 'bg-primary' : 'bg-gray-400')}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-red-500' : (isTickEnabled ? 'bg-primary' : 'bg-gray-400')}`}></span>
              </span>
              <span className={`font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{bpm} BPM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">info</span>
              </div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                 {language === 'EN' ? 'Current Mode:' : 'โหมดปัจจุบัน:'} <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>{label.name}</span> — {label.desc[language]}
              </p>
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
              <div className={`p-3 rounded-full ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-purple-500/10 text-purple-500'}`}>
                <span className="material-symbols-outlined">{isRecording ? 'recording' : 'settings_voice'}</span>
              </div>
              <p className={`font-medium text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                 {t.voiceHint[language]}
              </p>
            </div>
          </div>
        </div>

        <div className={`w-full lg:w-[440px] border-l p-10 flex flex-col justify-center gap-10 shadow-2xl transition-colors overflow-y-auto ${theme === 'dark' ? 'bg-[#1a2b2e] border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="text-center space-y-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.currentTempo[language]}</span>
            <div className={`text-8xl font-black tracking-tighter tabular-nums leading-none ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>
              {bpm} <span className="text-2xl text-gray-300 font-bold align-top mt-4 inline-block">BPM</span>
            </div>
          </div>

          <div className="space-y-8">
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

            {/* Metronome Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
               <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${isTickEnabled ? 'text-primary' : 'text-gray-400'}`}>
                    {isTickEnabled ? 'notifications_active' : 'notifications_off'}
                  </span>
                  <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.metronomeSound[language]}</span>
               </div>
               <label className="relative flex cursor-pointer items-center">
                  <input type="checkbox" checked={isTickEnabled} onChange={(e) => { initAudio(); setIsTickEnabled(e.target.checked); }} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
               </label>
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

          {/* Voice Experiment Section */}
          <div className={`p-6 rounded-3xl border flex flex-col gap-4 transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-black text-sm uppercase tracking-widest flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-[#101f22]'}`}>
              <span className="material-symbols-outlined text-primary">mic_none</span>
              {t.voiceExp[language]}
            </h3>
            
            <div className="flex gap-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${isRecording ? 'bg-red-500 text-white animate-pulse' : theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-700 hover:bg-gray-100'}`}
              >
                <span className="material-symbols-outlined">{isRecording ? 'stop' : 'mic'}</span>
                {isRecording ? t.stopRecord[language] : t.recordVoice[language]}
              </button>
              
              <button
                disabled={!recordedBuffer}
                onClick={toggleVoicePlayback}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${isVoicePlaying ? 'bg-primary text-white' : theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-700 hover:bg-gray-100'}`}
              >
                <span className="material-symbols-outlined">{isVoicePlaying ? 'stop' : 'play_arrow'}</span>
                {isVoicePlaying ? t.stopVoice[language] : t.playVoice[language]}
              </button>
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
