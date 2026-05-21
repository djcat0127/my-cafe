"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Coffee, Users, Map, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 컨셉 데이터 설정 ---
const CONCEPTS = [
  {
    id: 'focus',
    name: 'FOCUS',
    bg: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070',
    sound: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', // 집중용 차분한 소리
    desc: '오직 작업에만 몰입하는 시간입니다.'
  },
  {
    id: 'social',
    name: 'SOCIAL',
    bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047',
    sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3', // 카페 소음
    desc: '사람들과 함께 있는 듯한 적당한 소음이 집중력을 높여줍니다.'
  },
  {
    id: 'window',
    name: 'WINDOW',
    bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070',
    sound: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', // 풍경/빗소리
    desc: '창밖 풍경을 보며 여유롭게 집중해보세요.'
  }
];

export default function Home() {
  const [conceptIdx, setConceptIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [session, setSession] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 컨셉 변경 시 소리 업데이트
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = CONCEPTS[conceptIdx].sound;
      audioRef.current.loop = true;
      if (isActive) audioRef.current.play();
    }
  }, [conceptIdx]);

  // 타이머 로직
  useEffect(() => {
    let interval: any;
    if (isActive) {
      if (audioRef.current?.paused) audioRef.current.play().catch(() => {});
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleCycleEnd();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      audioRef.current?.pause();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleCycleEnd = () => {
    setIsActive(false);
    if (mode === 'FOCUS') {
      const nextSession = session < 4 ? session + 1 : 1;
      setSession(nextSession);
      setMode('REST');
      setTimeLeft(session === 4 ? 20 * 60 : 5 * 60);
    } else {
      setMode('FOCUS');
      setTimeLeft(25 * 60);
    }
  };

  const nextConcept = () => setConceptIdx((prev) => (prev + 1) % CONCEPTS.length);
  const prevConcept = () => setConceptIdx((prev) => (prev - 1 + CONCEPTS.length) % CONCEPTS.length);

  return (
    <main className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* 1. 배경 (애니메이션 전환) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={conceptIdx}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${CONCEPTS[conceptIdx].bg})` }}
        />
      </AnimatePresence>

      <audio ref={audioRef} />

      {/* 2. 컨셉 네비게이션 (상단) */}
      <div className="absolute top-10 flex items-center gap-6 z-20">
        <button onClick={prevConcept} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><ChevronLeft color="white"/></button>
        <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white tracking-[0.3em] text-xs font-bold">
          {CONCEPTS[conceptIdx].name}
        </div>
        <button onClick={nextConcept} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><ChevronRight color="white"/></button>
      </div>

      {/* 3. 기법 설명 버튼 (좌측 상단) */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-10 left-10 z-30 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/20 transition"
      >
        <Info size={20} />
      </button>

      {/* 기법 설명 팝업 */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="absolute top-24 left-10 z-30 w-72 bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 text-white text-sm leading-relaxed"
          >
            <h3 className="font-bold mb-3 text-orange-400">💡 뽀모도로 기법이란?</h3>
            <p className="mb-2 opacity-80">• <span className="text-white font-bold">집중 세션:</span> 25분간 한 가지 일에만 몰입합니다.</p>
            <p className="mb-2 opacity-80">• <span className="text-white font-bold">자동 휴식:</span> 집중이 끝나면 5분간 뇌를 식힙니다.</p>
            <p className="opacity-80">• <span className="text-white font-bold">4회 반복:</span> 4번의 집중 후엔 20분간 긴 휴식을 취합니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. 메인 타이머 (중앙) */}
      <div className="z-10 flex flex-col items-center">
        {/* 커피 컵 애니메이션 (중앙 오브제) */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 w-40 h-40 flex items-center justify-center bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl"
        >
          {conceptIdx === 0 && <Coffee size={60} color="white" strokeWidth={1} />}
          {conceptIdx === 1 && <Users size={60} color="white" strokeWidth={1} />}
          {conceptIdx === 2 && <Map size={60} color="white" strokeWidth={1} />}
        </motion.div>

        <div className="text-center">
          <div className="text-[10rem] md:text-[14rem] font-thin text-white leading-none tracking-tighter tabular-nums mb-8">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          
          <div className="flex items-center justify-center gap-10">
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="text-white/20 hover:text-white transition"><RotateCcw size={32}/></button>
            <button 
              onClick={() => setIsActive(!isActive)}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-2xl"
            >
              {isActive ? <Pause size={40} color="black" fill="black" /> : <Play size={40} color="black" fill="black" className="ml-1" />}
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/40 font-bold mb-1">{session}/4 SESSION</span>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= session ? 'bg-orange-500' : 'bg-white/10'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 하단 캡션 */}
      <div className="absolute bottom-10 text-white/30 text-[10px] tracking-[0.5em] uppercase font-light">
        {CONCEPTS[conceptIdx].desc}
      </div>
    </main>
  );
}