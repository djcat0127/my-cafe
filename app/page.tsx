"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, Trophy } from 'lucide-react';

export default function Home() {
  // --- 상태 관리 ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK'); // WORK, SHORT_BREAK, LONG_BREAK
  const [sessionCount, setSessionCount] = useState(1); // 1, 2, 3, 4 세션 추적
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const rainAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    cafeAudio.current = new Audio("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
    cafeAudio.current.loop = true;
    rainAudio.current = new Audio("https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg");
    rainAudio.current.loop = true;
  }, []);

  // --- 핵심 로직: 뽀모도로 사이클 자동 관리 ---
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleCycle(); // 시간이 다 되면 사이클 관리 함수 실행
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleCycle = () => {
    if (mode === 'WORK') {
      if (sessionCount < 4) {
        // 1, 2, 3번째 세션 종료 -> 짧은 휴식 (5분)
        alert(`${sessionCount}번째 집중 완료! 5분간 쉬세요.`);
        setMode('SHORT_BREAK');
        setTimeLeft(5 * 60);
      } else {
        // 4번째 세션 종료 -> 긴 휴식 (20분)
        alert(`대단해요! 4세션을 모두 마쳤습니다. 20분간 푹 쉬세요!`);
        setMode('LONG_BREAK');
        setTimeLeft(20 * 60);
      }
    } else {
      // 휴식(짧은/긴) 종료 -> 다음 작업 세션 준비
      if (mode === 'LONG_BREAK') {
        setSessionCount(1); // 긴 휴식 후 세션 초기화
      } else {
        setSessionCount(prev => prev + 1);
      }
      setMode('WORK');
      setTimeLeft(25 * 60);
      alert("휴식이 끝났습니다. 다시 집중해볼까요?");
    }
  };

  const toggleSound = (type: string) => {
    cafeAudio.current?.pause();
    rainAudio.current?.pause();
    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      const target = type === 'cafe' ? cafeAudio.current : rainAudio.current;
      target?.play().catch(() => alert("화면을 클릭한 후 소리를 켜주세요!"));
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070')`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      {/* 진행 상태 바 (커피 차오르는 효과) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: mode === 'WORK' ? 'rgba(92, 64, 51, 0.3)' : 'rgba(51, 64, 92, 0.3)',
        height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : (mode === 'SHORT_BREAK' ? 5*60 : 20*60))) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div style={{
        position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', 
        gap: '40px', maxWidth: '1100px', width: '90%', padding: '20px'
      }} className="main-container">
        
        {/* 타이머 섹션 */}
        <div style={{
          flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)',
          padding: '50px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          {/* 세션 카운터 표시 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: i <= sessionCount ? (mode === 'WORK' ? '#f97316' : '#60a5fa') : 'rgba(255,255,255,0.1)',
                boxShadow: i === sessionCount ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }} />
            ))}
          </div>

          <div style={{ fontSize: '12px', letterSpacing: '6px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>
            {mode === 'WORK' ? `${sessionCount}/4 FOCUS` : (mode === 'SHORT_BREAK' ? 'SHORT BREAK' : 'LONG BREAK')}
          </div>
          
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-8px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false); setSessionCount(1); setMode('WORK');}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={36} color="#000" fill="#000"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <div style={{ width: '28px' }} />
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
            <button onClick={() => toggleSound('cafe')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'cafe' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'cafe' ? '#000' : '#fff' }}><Coffee size={24} /></button>
            <button onClick={() => toggleSound('rain')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'rain' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'rain' ? '#000' : '#fff' }}><CloudRain size={24} /></button>
          </div>
        </div>

        {/* 할 일 목록 섹션 */}
        <div style={{
          width: '350px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)',
          padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>TODAY'S PLAN</span>
          </div>

          <form onSubmit={(e:any) => {
            e.preventDefault(); if(!newTodo) return;
            setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]);
            setNewTodo("");
          }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', marginBottom: '10px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CheckCircle2 size={18} color={todo.done ? "#f97316" : "rgba(255,255,255,0.1)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}