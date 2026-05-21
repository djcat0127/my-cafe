"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const soundsRef = useRef<any>({});

  useEffect(() => {
    // 더 안정적인 사운드 소스로 교체 (샘플 사운드)
    soundsRef.current = {
      cafe: new Howl({ 
        src: ['https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'], 
        loop: true, volume: 0.5, html5: true 
      }),
      rain: new Howl({ 
        src: ['https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'], 
        loop: true, volume: 0.5, html5: true 
      }),
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("집중 시간이 끝났습니다! 잠시 쉬어보세요.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleSound = (type: string) => {
    if (currentSound === type) {
      soundsRef.current[type].pause();
      setCurrentSound(null);
    } else {
      if (currentSound) soundsRef.current[currentSound].pause();
      soundsRef.current[type].play();
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
      {/* 배경 이미지: 더 따뜻한 느낌 */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2000')] bg-cover bg-center" />
      
      {/* 액체 차오르는 효과 (갈색) */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${(1 - timeLeft / (25 * 60)) * 100}%` }}
        className="absolute bottom-0 w-full bg-[#4a321f] opacity-30 transition-all duration-1000"
      />

      <div className="z-10 text-center space-y-8">
        <div className="space-y-2">
          <p className="text-sm tracking-[0.4em] uppercase opacity-50">Pomodoro Timer</p>
          <h1 className="text-[10rem] font-thin leading-none tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </h1>
        </div>

        <div className="flex justify-center items-center gap-10">
          <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="opacity-40 hover:opacity-100 transition">
            <RotateCcw size={32} />
          </button>
          
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-28 h-28 bg-[#e8dccb] text-[#1a1714] rounded-full flex items-center justify-center hover:scale-110 transition shadow-2xl"
          >
            {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
          </button>
          
          <div className="w-8" />
        </div>

        {/* 사운드 선택 영역 */}
        <div className="pt-10 flex flex-col items-center gap-4">
          <p className="text-xs opacity-40 font-bold tracking-widest uppercase">Select Ambiance</p>
          <div className="flex gap-4">
            <button 
              onClick={() => toggleSound('cafe')}
              className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${currentSound === 'cafe' ? 'bg-[#e8dccb] text-[#1a1714] border-[#e8dccb]' : 'border-white/10 hover:border-white/30'}`}
            >
              <Coffee size={20} />
              <span className="font-medium">Cafe ASMR</span>
            </button>
            
            <button 
              onClick={() => toggleSound('rain')}
              className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${currentSound === 'rain' ? 'bg-[#e8dccb] text-[#1a1714] border-[#e8dccb]' : 'border-white/10 hover:border-white/30'}`}
            >
              <CloudRain size={20} />
              <span className="font-medium">Rainy Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 문구 */}
      <p className="absolute bottom-10 text-[10px] opacity-20 tracking-[0.5em] uppercase">
        Create your own focus space
      </p>
    </main>
  );
}