"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2 } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [sessionCount, setSessionCount] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  // 소리 재생을 위한 핵심 Ref
  const audioCafe = useRef<HTMLAudioElement | null>(null);
  const audioRain = useRef<HTMLAudioElement | null>(null);

  // 타이머 로직
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = mode === 'FOCUS' ? (sessionCount < 4 ? 'REST' : 'LONG_REST') : 'FOCUS';
      if (mode === 'FOCUS') setSessionCount(prev => prev < 4 ? prev + 1 : 1);
      setMode(nextMode);
      setTimeLeft(nextMode === 'FOCUS' ? 25 * 60 : (nextMode === 'REST' ? 5 * 60 : 20 * 60));
      alert(mode === 'FOCUS' ? "Break Time!" : "Focus Time!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionCount]);

  // 소리 제어 함수 (가장 확실한 방식)
  const handleSound = (type: string) => {
    // 일단 모든 소리 정지
    if (audioCafe.current) audioCafe.current.pause();
    if (audioRain.current) audioRain.current.pause();

    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      const target = type === 'cafe' ? audioCafe.current : audioRain.current;
      if (target) {
        target.play().catch(() => {
          alert("브라우저 보안으로 인해 화면을 한 번 클릭한 후 다시 소리를 켜주세요!");
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
    <div style={{
      backgroundColor: '#000', color: '#fff', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      {/* 1. 배경 이미지: 원본 사이트처럼 어둡고 입자감이 느껴지는 감성 사진 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.7) contrast(1.1)', transform: 'scale(1.1)'
      }} />

      {/* 2. 숨겨진 오디오 태그 (HTML5 표준 방식 - 가장 소리가 잘 남) */}
      <audio ref={audioCafe} src="https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3" loop />
      <audio ref={audioRain} src="https://www.soundjay.com/nature/sounds/rain-01.mp3" loop />

      {/* 3. 메인 레이아웃 */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '60px', alignItems: 'flex-start', maxWidth: '1200px', width: '90%' }} className="container">
        
        {/* 타이머 구역 */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', letterSpacing: '8px', opacity: 0.4, marginBottom: '20px' }}>
            {mode} {sessionCount}/4
          </div>
          <h1 style={{ fontSize: '200px', fontWeight: 100, margin: '0 0 40px 0', letterSpacing: '-12px', lineHeight: 0.8 }}>
            {formatTime(timeLeft)}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.2, cursor: 'pointer' }}><RotateCcw size={32}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ background: '#fff', border: 'none', width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
              {isActive ? <Pause size={48} color="#000" fill="#000"/> : <Play size={48} color="#000" fill="#000" style={{marginLeft: '6px'}}/>}
            </button>
            <div style={{ width: '32px' }} />
          </div>

          <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => handleSound('cafe')} style={{ padding: '20px 30px', borderRadius: '20px', border: currentSound === 'cafe' ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)', background: currentSound === 'cafe' ? '#fff' : 'transparent', color: currentSound === 'cafe' ? '#000' : '#fff', cursor: 'pointer', transition: '0.3s' }}>
              <Coffee size={24} />
            </button>
            <button onClick={() => handleSound('rain')} style={{ padding: '20px 30px', borderRadius: '20px', border: currentSound === 'rain' ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)', background: currentSound === 'rain' ? '#fff' : 'transparent', color: currentSound === 'rain' ? '#000' : '#fff', cursor: 'pointer', transition: '0.3s' }}>
              <CloudRain size={24} />
            </button>
          </div>
        </div>

        {/* 할 일 목록 (원본 사이트에는 없지만 성능을 위해 미니멀하게 추가) */}
        <div style={{ width: '350px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(40px)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }} className="todo-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', opacity: 0.5 }}>
            <ListTodo size={20} /> <span style={{ fontSize: '14px', letterSpacing: '2px' }}>TASK LIST</span>
          </div>
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Next task..." style={{ flex: 1, background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', color: '#fff', outline: 'none', fontSize: '14px' }} />
          </form>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {todos.map(t => (
              <div key={t.id} onClick={() => setTodos(todos.map(td => td.id === t.id ? {...td, done: !td.done} : td))} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', opacity: t.done ? 0.3 : 1 }}>
                <CheckCircle2 size={16} color={t.done ? "#fff" : "rgba(255,255,255,0.2)"} />
                <span style={{ fontSize: '14px', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;500&display=swap');
        @media (max-width: 1000px) {
          .container { flex-direction: column; align-items: center; }
          .todo-box { width: 100%; display: none; } /* 모바일에서는 타이머만 집중 */
          h1 { fontSize: 120px !important; }
        }
      `}</style>
    </div>
  );
}