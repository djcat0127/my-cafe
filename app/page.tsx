"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Info, Users } from 'lucide-react';

const CONCEPTS = [
  {
    id: 'focus', name: 'FOCUS',
    bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000',
    sound: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', // 차분한 집중음
    desc: '오직 작업에만 몰입하는 시간입니다.'
  },
  {
    id: 'social', name: 'SOCIAL',
    bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047',
    sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3', // 확실히 검증된 카페 소음
    desc: '사람들의 웅성거림이 창의력을 자극합니다.'
  },
  {
    id: 'window', name: 'WINDOW',
    bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070',
    sound: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', // 확실히 검증된 빗소리
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    return () => audioRef.current?.pause();
  }, []);

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
      alert("집중 완료! 휴식 시간입니다.");
    } else {
      setMode('FOCUS');
      setTimeLeft(25 * 60);
      alert("휴식 끝! 다시 집중해볼까요?");
    }
  };

  const toggleSound = (type: string) => {
    if (!audioRef.current) return;
    if (currentSound === type) {
      audioRef.current.pause();
      setCurrentSound(null);
    } else {
      audioRef.current.src = CONCEPTS.find(c => c.id === type)?.sound || "";
      audioRef.current.play().catch(() => alert("화면을 클릭한 후 소리를 켜주세요!"));
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const containerStyle: any = {
    backgroundColor: '#000', color: '#fff', minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${CONCEPTS[conceptIdx].bg})`,
    backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 1s ease-in-out'
  };

  return (
    <div style={containerStyle}>
      {/* 1. 커피 차오르는 효과 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: mode === 'FOCUS' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : (session === 4 ? 20*60 : 5*60))) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%' }} className="main-box">
        
        {/* [왼쪽] 타이머 섹션 */}
        <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)', padding: '60px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= session ? '#f97316' : 'rgba(255,255,255,0.1)', boxShadow: i === session ? '0 0 10px #f97316' : 'none' }} />
            ))}
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {session}/4</div>
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false); setSession(1);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
              {isActive ? <Pause size={36} color="#000" fill="#000"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <button onClick={() => setShowInfo(!showInfo)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Info size={28}/></button>
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '15px' }}>
            <button onClick={() => {setConceptIdx(0); toggleSound('focus');}} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'focus' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'focus' ? '#000' : '#fff' }}><Coffee size={24} /></button>
            <button onClick={() => {setConceptIdx(1); toggleSound('social');}} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'social' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'social' ? '#000' : '#fff' }}><Users size={24} /></button>
            <button onClick={() => {setConceptIdx(2); toggleSound('window');}} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'window' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'window' ? '#000' : '#fff' }}><CloudRain size={24} /></button>
          </div>
        </div>

        {/* [오른쪽] 플래너 섹션 */}
        <div style={{ width: '350px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '1px' }}>PLANNER</span>
          </div>

          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', marginBottom: '10px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CheckCircle2 size={18} color={todo.done ? "#f97316" : "rgba(255,255,255,0.2)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 뽀모도로 가이드 모달 */}
      {showInfo && (
        <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '350px', textAlign: 'center' }}>
          <h3 style={{ color: '#f97316', marginBottom: '20px' }}>뽀모도로 기법 가이드</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.8, textAlign: 'left' }}>
            • <strong>FOCUS:</strong> 25분간 한 업무에만 집중합니다.<br/>
            • <strong>REST:</strong> 종료 후 5분간 휴식합니다.<br/>
            • <strong>1/4 세션:</strong> 4회 반복 후 20분간 긴 휴식을 취합니다.<br/><br/>
            현재 선택된 테마: <strong>{CONCEPTS[conceptIdx].name}</strong><br/>
            {CONCEPTS[conceptIdx].desc}
          </p>
          <button onClick={() => setShowInfo(false)} style={{ marginTop: '30px', padding: '10px 30px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>닫기</button>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 1000px) {
          .main-box { flex-direction: column !important; align-items: center !important; }
          .main-box > div { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
}