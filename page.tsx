"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import { Howl } from 'howler';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const soundsRef = useRef<any>({});

  useEffect(() => {
    soundsRef.current = {
      cafe: new Howl({ src: ['https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3'], loop: true }),
      rain: new Howl({ src: ['https://www.soundjay.com/nature/sounds/rain-01.mp3'], loop: true }),
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
    if (currentSound === type) {
      soundsRef.current[type].stop();
      setCurrentSound(null);
    } else {
      if (currentSound) soundsRef.current[currentSound].stop();
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
    <main className="relative h-screen flex items-center justify-center bg-[#121212] overflow-hidden text-white">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078')] bg-cover bg-center" />
      
      <div className="z-10 text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <h1 className="text-7xl md:text-9xl font-light mb-12 tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </h1>
          
          <div className="flex justify-center gap-8 items-center">
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="text-white/40 hover:text-white transition">
              <RotateCcw size={32} />
            </button>
            <button 
              onClick={() => setIsActive(!isActive)}
              className="w-20 h-20 md:w-24 md:h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-white/20 shadow-2xl"
            >
              {isActive ? <Pause size={40} fill="black" /> : <Play size={40} fill="black" className="ml-1" />}
            </button>
            <div className="w-8" />
          </div>
        </motion.div>

        <div className="mt-12 flex justify-center gap-6">
          <button 
            onClick={() => toggleSound('cafe')}
            className={`p-4 rounded-2xl transition ${currentSound === 'cafe' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Coffee size={24} />
          </button>
          <button 
            onClick={() => toggleSound('rain')}
            className={`p-4 rounded-2xl transition ${currentSound === 'rain' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <CloudRain size={24} />
          </button>
        </div>
      </div>
    </main>
  );
}