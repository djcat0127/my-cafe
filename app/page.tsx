"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Users, CloudRain, ListTodo, CheckCircle2, Trash2, Info, X } from 'lucide-react';

// 컨셉 데이터 (소리/이미지/설명)
const CONCEPTS = [
  { id: 'focus', name: 'FOCUS', bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000', sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3', desc: '집중 모드: 25분간 한 가지 일에만 몰입합니다.' },
  { id: 'social', name: 'SOCIAL', bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047', sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-chatter-1.mp3', desc: '소셜 모드: 사람들의 백색 소음이 창의력을 돕습니다.' },
  { id: 'window', name: 'WINDOW', bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070', sound: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', desc: '윈도우 모드: 창밖 빗소리와 함께 차분하게 작업합니다.' }
];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false); // 시작 버튼 클릭 여부
  const [conceptIdx, setConceptIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK');
  const [session, setSession] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 초기 사운드 세팅
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    return () => audioRef.current?.pause();
  }, []);

  // 타이머 엔진
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleCycle();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleCycle = () => {
    if (mode === 'WORK') {
      if (session < 4) { setMode('REST'); setTimeLeft(5 * 60); }
      else { setMode('LONG_REST'); setTimeLeft(20 * 60); }
      setSession(prev => prev < 4 ? prev + 1 : 1);
    } else {
      setMode('WORK'); setTimeLeft(25 * 60);
    }
  };

  const toggleSound = (type: string) => {
    if (!audioRef.current) return;
    if (currentSound === type) {
      audioRef.current.pause();
      setCurrentSound(null);
    } else {
      audioRef.current.src = CONCEPTS.find(c => c.id === type)?.sound || "";
      audioRef.current.play();
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  // --- 시작하기 화면 (소리 잠금 해제용) ---
  if (!hasStarted) {
    return (
      <div onClick={() => setHasStarted(true)} style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Coffee size={60} style={{ marginBottom: '20px', opacity: 0.5 }} />
        <h1 style={{ fontSize: '24px', fontWeight: 200, letterSpacing: '5px' }}>CAFE POMODORO</h1>
        <p style={{ marginTop: '20px', fontSize: '12px', opacity: 0.4 }}>화면을 클릭하여 집중을 시작하세요</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${CONCEPTS[conceptIdx].bg})`,
      backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 1s ease'
    }}>
      {/* 진행바 (커피 차오르는 효과) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(249, 115, 22, 0.1)', height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : (mode === 'REST' ? 5*60 : 20*60))) * 100}%`, transition: 'height 1s linear', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%' }} className="main-container">
        
        {/* [왼쪽] 타이머 섹션 */}
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', padding: '60px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i < session || (i === session && mode !== 'WORK') ? '#f97316' : 'rgba(255,255,255,0.1)', boxShadow: i === session ? '0 0 10px #f97316' : 'none' }} />
            ))}
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {session}/4</div>
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '50px' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={36} color="#000" fill="#000"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <button onClick={() => setShowInfo(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Info size={28}/></button>
          </div>

          {/* 테마/사운드 선택 */}
          <div style={{ display: 'flex', gap: '15px' }}>
            {CONCEPTS.map((c, idx) => (
              <button 
                key={c.id}
                onClick={() => {setConceptIdx(idx); toggleSound(c.id);}}
                style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === c.id ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === c.id ? '#000' : '#fff', transition: '0.3s' }}
              >
                {c.id === 'focus' && <Coffee size={24} />}
                {c.id === 'social' && <Users size={24} />}
                {c.id === 'window' && <CloudRain size={24} />}
              </button>
            ))}
          </div>
        </div>

        {/* [오른쪽] 할 일 목록 */}
        <div style={{ width: '350px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>PLANNER</span>
          </div>
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
          </form>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '18px', borderRadius: '20px', marginBottom: '12px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CheckCircle2 size={20} color={todo.done ? "#f97316" : "rgba(255,255,255,0.1)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 뽀모도로 가이드 모달 */}
      {showInfo && (
        <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ color: '#f97316', margin: 0 }}>뽀모도로 기법</h3>
            <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', opacity: 0.8 }}>
            <strong>1. FOCUS:</strong> 25분간 집중합니다.<br/>
            <strong>2. REST:</strong> 5분간 휴식합니다.<br/>
            <strong>3. CYCLE:</strong> 4회 반복 후 20분간 긴 휴식을 취합니다.<br/><br/>
            <span style={{ color: '#f97316' }}>{CONCEPTS[conceptIdx].desc}</span>
          </p>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 1000px) {
          .main-container { flex-direction: column !important; align-items: center !important; }
          .main-container > div { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}