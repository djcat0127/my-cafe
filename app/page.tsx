"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  const audioRef = useRef<any>({});

  useEffect(() => {
    // 사운드 세팅
    audioRef.current = {
      cafe: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-423.mp3"),
      rain: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3")
    };
    audioRef.current.cafe.loop = true;
    audioRef.current.rain.loop = true;
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(mode === 'FOCUS' ? "집중 끝! 쉬는 시간입니다." : "휴식 끝! 다시 시작할까요?");
      const nextMode = mode === 'FOCUS' ? 'REST' : 'FOCUS';
      setMode(nextMode);
      setTimeLeft(nextMode === 'FOCUS' ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleSound = (type: string) => {
    Object.values(audioRef.current).forEach((a: any) => a.pause());
    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      audioRef.current[type].play();
      setCurrentSound(type);
    }
  };

  const addTodo = (e: any) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), text: newTodo, done: false }, ...todos]);
    setNewTodo("");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center p-4 lg:p-20 overflow-x-hidden">
      {/* 1. 배경 이미지 & 커피 애니메이션 */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070')] bg-cover bg-center" />
      <motion.div 
        animate={{ height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : 5*60)) * 100}%` }}
        className="absolute bottom-0 left-0 right-0 bg-orange-900/30 backdrop-blur-[2px] transition-all duration-1000"
      />

      {/* 2. 메인 컨테이너 (좌우 2단 구성) */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* [왼쪽 칸: 타이머] */}
        <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl">
          <div className="mb-6 px-4 py-1 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-500 text-xs font-bold tracking-[0.3em]">
            {mode} MODE
          </div>
          
          <h1 className="text-[10rem] lg:text-[13rem] font-thin leading-none tracking-tighter tabular-nums mb-12">
            {formatTime(timeLeft)}
          </h1>

          <div className="flex items-center gap-10">
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} className="text-white/20 hover:text-white transition">
              <RotateCcw size={32} />
            </button>
            <button onClick={() => setIsActive(!isActive)} className="w-28 h-28 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-xl">
              {isActive ? <Pause size={48} fill="black" /> : <Play size={48} fill="black" className="ml-1" />}
            </button>
            <div className="w-10" />
          </div>

          <div className="mt-12 flex gap-4">
            <button onClick={() => toggleSound('cafe')} className={`p-4 rounded-2xl transition-all ${currentSound === 'cafe' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/40'}`}>
              <Coffee size={24} />
            </button>
            <button onClick={() => toggleSound('rain')} className={`p-4 rounded-2xl transition-all ${currentSound === 'rain' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/40'}`}>
              <CloudRain size={24} />
            </button>
          </div>
        </div>

        {/* [오른쪽 칸: 할 일 목록] */}
        <div className="w-full lg:w-[400px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 flex flex-col shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <ListTodo className="text-orange-400" />
            <h2 className="text-xl font-light tracking-tight">Today's Focus</h2>
          </div>

          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input 
              type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
              placeholder="무엇에 집중할까요?"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition"
            />
            <button className="bg-white text-black px-4 rounded-xl font-bold hover:bg-orange-100 transition">+</button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {todos.map(todo => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                key={todo.id} 
                className="group flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition"
              >
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))}>
                  <CheckCircle2 size={20} className={todo.done ? "text-orange-500" : "text-white/10"} />
                </button>
                <span className={`flex-1 text-sm ${todo.done ? "line-through opacity-30" : "opacity-80"}`}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            {todos.length === 0 && (
              <div className="text-center mt-20 opacity-20 text-sm italic font-thin">
                할 일을 추가하고 집중을 시작하세요.
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}