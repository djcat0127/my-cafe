"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  
  // 브라우저 기본 오디오 객체 사용 (Howler 없이 더 확실하게)
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const rainAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 안정적인 사운드 링크 (Mixkit - 무료 효과음 CDN)
    cafeAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-423.mp3");
    cafeAudio.current.loop = true;
    
    rainAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3");
    rainAudio.current.loop = true;

    return () => {
      cafeAudio.current?.pause();
      rainAudio.current?.pause();
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleSound = (type: string) => {
    // 모든 소리 일단 정지
    cafeAudio.current?.pause();
    rainAudio.current?.pause();

    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      const target = type === 'cafe' ? cafeAudio.current : rainAudio.current;
      target?.play().catch(e => console.log("클릭 후 다시 시도해주세요"));
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <main className="relative h-screen flex flex-col items-center justify-center bg-[#1a1714] text-[#e8dccb] overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2000')] bg-cover bg-center" />
      
      <motion.div 
        animate={{ height: `${(1 - timeLeft / (25 * 60)) * 100}%` }}
        className="absolute bottom-0 w-full bg-[#4a321f] opacity-30 transition-all duration-1000"
      />

      <div className="z-10 text-center space-y-12">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.4em] uppercase opacity-40">Focus Mode</p>
          <h1 className="text-[10rem] font-thin leading-none tracking-tighter tabular-nums drop-shadow-2xl">
            {formatTime(timeLeft)}
          </h1>
        </div>

        <div className="flex justify-center items-center gap-12">
          <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="opacity-40 hover:opacity-100 transition">
            <RotateCcw size={32} />
          </button>
          
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-32 h-32 bg-[#e8dccb] text-[#1a1714] rounded-full flex items-center justify-center hover:scale-110 transition shadow-[0_0_50px_rgba(232,220,203,0.3)]"
          >
            {isActive ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" className="ml-2" />}
          </button>
          
          <div className="w-8" />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <button 
              onClick={() => toggleSound('cafe')}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl border transition-all ${currentSound === 'cafe' ? 'bg-[#e8dccb] text-[#1a1714]' : 'bg-black/20 border-white/10'}`}
            >
              <Coffee size={24} />
              <span className="font-bold tracking-tight">Cafe Ambiance</span>
            </button>
            
            <button 
              onClick={() => toggleSound('rain')}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl border transition-all ${currentSound === 'rain' ? 'bg-[#e8dccb] text-[#1a1714]' : 'bg-black/20 border-white/10'}`}
            >
              <CloudRain size={24} />
              <span className="font-bold tracking-tight">Rainy Night</span>
            </button>
          </div>
          {currentSound && (
            <div className="flex items-center gap-2 text-xs opacity-50 animate-pulse">
              <Volume2 size={14} />
              <span>사운드 재생 중...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}