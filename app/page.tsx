"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, Volume2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [sessionCount, setSessionCount] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showSoundError, setShowSoundError] = useState(false);
  
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const rainAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 가장 확실하게 재생되는 고음질 MP3 주소로 교체
    cafeAudio.current = new Audio("https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3");
    rainAudio.current = new Audio("https://www.soundjay.com/nature/sounds/rain-01.mp3");
    cafeAudio.current.loop = true;
    rainAudio.current.loop = true;
  }, []);

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
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleSound = async (type: string) => {
    try {
      cafeAudio.current?.pause();
      rainAudio.current?.pause();

      if (currentSound === type) {
        setCurrentSound(null);
      } else {
        const target = type === 'cafe' ? cafeAudio.current : rainAudio.current;
        if (target) {
          await target.play();
          setCurrentSound(type);
          setShowSoundError(false);
        }
      }
    } catch (err) {
      // 소리 재생 실패 시 (브라우저 차단 등) 에러 메시지 표시
      setShowSoundError(true);
      setTimeout(() => setShowSoundError(false), 5000);
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
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078')`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      {/* 1. 소리 재생 실패 시 안내창 */}
      {showSoundError && (
        <div style={{ position: 'fixed', top: '20px', backgroundColor: '#f97316', color: '#fff', padding: '15px 25px', borderRadius: '15px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <AlertCircle size={20} />
          <span>화면을 한 번 클릭한 후 다시 소리를 켜주세요!</span>
        </div>
      )}

      {/* 2. 타이머 차오르는 효과 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: mode === 'FOCUS' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : (mode === 'REST' ? 5*60 : 20*60))) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%' }} className="main-container">
        
        {/* [왼쪽] 타이머 섹션 */}
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', padding: '60px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: i <= sessionCount ? '#f97316' : 'rgba(255,255,255,0.1)', boxShadow: i === sessionCount ? '0 0 15px #f97316' : 'none' }} />
            ))}
          </div>
          <div style={{ fontSize: '12px', letterSpacing: '6px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {sessionCount}/4</div>
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-8px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false); setSessionCount(1);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', outline: 'none' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: isActive ? '#f97316' : '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}>
              {isActive ? <Pause size={36} color="#fff" fill="#fff"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <div style={{ width: '28px' }} />
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
            <button onClick={() => toggleSound('cafe')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'cafe' ? '#f97316' : 'rgba(255,255,255,0.05)', color: '#fff', transition: '0.3s' }}>
              <Coffee size={24} />
            </button>
            <button onClick={() => toggleSound('rain')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'rain' ? '#f97316' : 'rgba(255,255,255,0.05)', color: '#fff', transition: '0.3s' }}>
              <CloudRain size={24} />
            </button>
          </div>
        </div>

        {/* [오른쪽] 할 일 목록 */}
        <div style={{ width: '350px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>TODAY'S PLAN</span>
          </div>

          <form onSubmit={(e:any) => {
            e.preventDefault();
            if(!newTodo) return;
            setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]);
            setNewTodo("");
          }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '18px', borderRadius: '20px', marginBottom: '12px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <CheckCircle2 size={20} color={todo.done ? "#f97316" : "rgba(255,255,255,0.1)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}