"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, CheckCircle2, ListTodo, Flame, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // --- 상태 관리 ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK'); // WORK or BREAK
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078");

  const audioRef = useRef<any>({});

  // --- 사운드 초기 설정 ---
  useEffect(() => {
    audioRef.current = {
      cafe: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-423.mp3"),
      rain: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3"),
    };
    audioRef.current.cafe.loop = true;
    audioRef.current.rain.loop = true;

    // 저장된 데이터 불러오기
    const saved = localStorage.getItem('pomodoro-count');
    if (saved) setCompletedPomodoros(parseInt(saved));
  }, []);

  // --- 타이머 로직 ---
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'WORK') {
        const nextCount = completedPomodoros + 1;
        setCompletedPomodoros(nextCount);
        localStorage.setItem('pomodoro-count', nextCount.toString());
        alert("한 잔의 집중 완료! 5분 휴식하세요.");
        setMode('BREAK');
        setTimeLeft(5 * 60);
      } else {
        alert("휴식 끝! 다시 집중해볼까요?");
        setMode('WORK');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedPomodoros]);

  // --- 기능 함수들 ---
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
    setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
    setNewTodo("");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <main className="relative h-screen flex flex-col md:flex-row items-center justify-center bg-[#0d0d0d] text-[#f4f1ee] p-4 gap-8">
      {/* 배경 & 커피 차오르는 효과 */}
      <div className="absolute inset-0 opacity-30 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${bgImage})` }} />
      <motion.div 
        animate={{ height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : 5*60)) * 100}%` }}
        className="absolute bottom-0 w-full bg-[#3d2b1f]/60 backdrop-blur-[1px] transition-all duration-1000"
      />

      {/* 왼쪽: 타이머 섹션 */}
      <div className="z-10 w-full max-w-md flex flex-col items-center">
        <div className="bg-black/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl w-full text-center">
          <div className="flex justify-center gap-4 mb-6">
            <span className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-widest ${mode === 'WORK' ? 'bg-orange-900/50 border border-orange-500' : 'bg-blue-900/50 border border-blue-500'}`}>
              {mode} MODE
            </span>
          </div>
          
          <h1 className="text-9xl font-thin mb-10 tabular-nums tracking-tighter drop-shadow-2xl">
            {formatTime(timeLeft)}
          </h1>
          
          <div className="flex justify-center gap-10 items-center">
            <button onClick={() => {setTimeLeft(mode === 'WORK' ? 25*60 : 5*60); setIsActive(false);}} className="opacity-30 hover:opacity-100 transition"><RotateCcw size={28} /></button>
            <button onClick={() => setIsActive(!isActive)} className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 shadow-xl transition">
              {isActive ? <Pause size={44} fill="black" /> : <Play size={44} fill="black" className="ml-1" />}
            </button>
            <div className="flex flex-col items-center opacity-40">
              <span className="text-[10px] font-bold">DONE</span>
              <span className="text-xl serif">{completedPomodoros}</span>
            </div>
          </div>
        </div>

        {/* 사운드 & 테마 제어 */}
        <div className="mt-6 flex gap-3">
          <button onClick={() => toggleSound('cafe')} className={`p-4 rounded-2xl transition-all ${currentSound === 'cafe' ? 'bg-white text-black' : 'bg-white/5 border border-white/10'}`}><Coffee size={20} /></button>
          <button onClick={() => toggleSound('rain')} className={`p-4 rounded-2xl transition-all ${currentSound === 'rain' ? 'bg-white text-black' : 'bg-white/5 border border-white/10'}`}><CloudRain size={20} /></button>
          <button onClick={() => setBgImage("https://images.unsplash.com/photo-1511081692775-0574deb35949?q=80&w=2000")} className="p-4 rounded-2xl bg-white/5 border border-white/10"><Sun size={20} /></button>
          <button onClick={() => setBgImage("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000")} className="p-4 rounded-2xl bg-white/5 border border-white/10"><Moon size={20} /></button>
        </div>
      </div>

      {/* 오른쪽: 할 일 목록 섹션 */}
      <div className="z-10 w-full max-w-sm h-[500px] bg-black/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <ListTodo size={20} className="text-orange-400" />
          <h2 className="text-lg font-medium">To-Do List</h2>
        </div>

        <form onSubmit={addTodo} className="mb-6 flex gap-2">
          <input 
            type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
            placeholder="할 일을 적어보세요..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-white/30 text-sm"
          />
          <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">+</button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {todos.map(todo => (
            <div key={todo.id} onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition border border-white/5">
              <CheckCircle2 size={18} className={todo.done ? "text-green-500" : "text-white/20"} />
              <span className={`text-sm ${todo.done ? "line-through opacity-30" : ""}`}>{todo.text}</span>
            </div>
          ))}
          {todos.length === 0 && <p className="text-center text-white/20 text-xs mt-20 italic font-thin">할 일이 비어있습니다.</p>}
        </div>
      </div>
    </main>
  );
}