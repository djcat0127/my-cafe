"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONCEPTS = [
  {
    id: 'focus', name: 'FOCUS',
    bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000',
    sound: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    desc: '오직 작업에만 몰입하는 시간입니다.'
  },
  {
    id: 'social', name: 'SOCIAL',
    bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047',
    sound: 'https://actions.google.com/sounds/v1/ambiences/inner_city_traffic.ogg',
    desc: '백색 소음이 창의력을 자극합니다.'
  },
  {
    id: 'window', name: 'WINDOW',
    bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070',
    sound: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    desc: '창밖 풍경과 함께 여유를 가지세요.'
  }
];

export default function Home() {
  const [conceptIdx, setConceptIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [session, setSession] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  
  // 오디오 객체를 하나만 생성해서 관리 (메모리 절약 및 성능 향상)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    return () => audioRef.current?.pause();
  }, []);

  // 타이머 로직
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleCycleEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleCycleEnd = () => {
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

  // 소리 재생 함수 (가장 중요)
  const toggleSound = (type: string) => {
    if (!audioRef.current) return;

    if (currentSound === type) {
      audioRef.current.pause();
      setCurrentSound(null);
    } else {
      const soundUrl = CONCEPTS.find(c => c.id === type)?.sound;
      if (soundUrl) {
        audioRef.current.src = soundUrl;
        audioRef.current.play().catch(() => {
          alert("화면을 아무 곳이나 클릭한 후 다시 소리를 켜주세요!");
        });
        setCurrentSound(type);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans text-white">
      {/* 1. 배경 이미지 (테마 전환) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={conceptIdx}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center shadow-inner"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${CONCEPTS[conceptIdx].bg})` }}
        />
      </AnimatePresence>

      {/* 2. 타이머 차오르는 효과 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: mode === 'FOCUS' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(59, 130, 246, 0.15)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : (session === 4 ? 20*60 : 5*60))) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
        
        {/* [왼쪽] 타이머 섹션 */}
        <div className="flex-1 bg-black/30 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 flex flex-col items-center justify-center shadow-2xl w-full">
          {/* 세션 카운터 */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i <= session ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-white/10'}`} />
            ))}
          </div>

          <div className="text-[10px] tracking-[0.6em] opacity-40 mb-2 font-bold uppercase">{mode} {session}/4</div>
          <h1 className="text-[10rem] lg:text-[13rem] font-thin leading-none tracking-tighter tabular-nums mb-12 drop-shadow-2xl">
            {formatTime(timeLeft)}
          </h1>

          <div className="flex items-center gap-12 mb-12">
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="text-white/20 hover:text-white transition-all"><RotateCcw size={32}/></button>
            <button 
              onClick={() => setIsActive(!isActive)}
              className="w-28 h-28 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
            >
              {isActive ? <Pause size={50} fill="black" /> : <Play size={50} fill="black" className="ml-2" />}
            </button>
            <button onClick={() => setShowInfo(!showInfo)} className="text-white/20 hover:text-white transition-all"><Info size={32}/></button>
          </div>

          {/* 컨셉 전환 버튼 */}
          <div className="flex gap-4">
            {CONCEPTS.map((concept, idx) => (
              <button 
                key={concept.id}
                onClick={() => {setConceptIdx(idx); toggleSound(concept.id);}}
                className={`flex flex-col items-center gap-2 p-5 rounded-[2.5rem] transition-all border ${currentSound === concept.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                {concept.id === 'focus' && <Coffee size={24} />}
                {concept.id === 'social' && <Coffee size={24} strokeWidth={3} />}
                {concept.id === 'window' && <CloudRain size={24} />}
                <span className="text-[8px] font-bold tracking-widest">{concept.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* [오른쪽] 할 일 목록 */}
        <div className="w-full lg:w-[400px] bg-black/30 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 flex flex-col shadow-2xl">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
            <ListTodo size={20} className="text-orange-500" />
            <h2 className="text-xl font-light tracking-wide italic">Today's Focus</h2>
          </div>

          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} className="flex gap-3 mb-8">
            <input 
              value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What to focus on?"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-orange-500/50 transition-all"
            />
            <button className="bg-white text-black w-14 rounded-2xl font-black text-xl hover:bg-orange-100 transition-all">+</button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scroll">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))}>
                  <CheckCircle2 size={22} className={todo.done ? "text-orange-500" : "text-white/10"} />
                </button>
                <span className={`flex-1 text-sm ${todo.done ? "line-through opacity-30" : "opacity-80"}`}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 기법 설명 모달 */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bg-black/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/20 max-w-sm text-center shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6 text-orange-500">뽀모도로 가이드</h3>
            <div className="text-left space-y-4 text-sm opacity-80 leading-relaxed">
              <p>• <strong>FOCUS:</strong> 25분 동안 오직 작업에만 몰입합니다.</p>
              <p>• <strong>REST:</strong> 세션이 끝나면 5분간 휴식합니다.</p>
              <p>• <strong>CYCLE:</strong> 4회 집중 후엔 20분의 긴 휴식을 가집니다.</p>
              <p className="pt-4 text-[11px] text-center italic text-orange-300">"가장 효율적인 집중 리듬을 경험하세요."</p>
            </div>
            <button onClick={() => setShowInfo(false)} className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest">닫기</button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </main>
  );
}