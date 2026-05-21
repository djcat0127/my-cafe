"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Users, CloudRain, ListTodo, CheckCircle2, Trash2, Info, Volume2 } from 'lucide-react';

const CONCEPTS = [
  { id: 'focus', name: 'FOCUS', bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000', sound: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', desc: '집중 모드: 25분간 몰입합니다.' },
  { id: 'social', name: 'SOCIAL', bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047', sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3', desc: '소셜 모드: 카페 소음으로 창의력을 높입니다.' },
  { id: 'window', name: 'WINDOW', bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070', sound: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', desc: '윈도우 모드: 창밖 빗소리와 함께 작업합니다.' }
];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [conceptIdx, setConceptIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK');
  const [session, setSession] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 모바일 대응용

  const mainAudio = useRef<HTMLAudioElement | null>(null);

  // 화면 크기 체크 (에러 방지를 위해 useEffect 안에서 실행)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    mainAudio.current = new Audio();
    mainAudio.current.loop = true;
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (!mainAudio.current) return;
    if (currentSound === type) {
      mainAudio.current.pause();
      setCurrentSound(null);
    } else {
      mainAudio.current.pause();
      const soundUrl = CONCEPTS.find(c => c.id === type)?.sound || "";
      mainAudio.current.src = soundUrl;
      mainAudio.current.load();
      mainAudio.current.play().then(() => setCurrentSound(type)).catch(() => alert("클릭 후 다시 눌러주세요!"));
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!hasStarted) {
    return (
      <div onClick={() => setHasStarted(true)} style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', marginBottom: '30px' }}>
          <Play size={60} fill="white" />
        </div>
        <h1 style={{ fontSize: '20px', letterSpacing: '10px', fontWeight: 200 }}>ENTER CAFE</h1>
        <p style={{ marginTop: '20px', opacity: 0.3 }}>클릭하여 입장하세요</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${CONCEPTS[conceptIdx].bg})`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      {/* progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(249, 115, 22, 0.1)', height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : (mode === 'REST' ? 5*60 : 20*60))) * 100}%`, transition: 'height 1s linear' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '40px', maxWidth: '1100px', width: '90%', alignItems: 'center' }}>
        
        {/* 타이머 구역 */}
        <div style={{ flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(50px)', padding: '60px 40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= session ? '#f97316' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.4, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {session}/4</div>
          <div style={{ fontSize: 'min(150px, 20vw)', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '60px' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={40} color="#000" fill="#000"/> : <Play size={40} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <button onClick={() => setShowInfo(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Info size={28}/></button>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => {setConceptIdx(0); toggleSound('focus');}} style={{ padding: '20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'focus' ? '#fff' : 'rgba(255,255,255,0.03)', color: currentSound === 'focus' ? '#000' : '#fff' }}><Coffee size={24} /></button>
            <button onClick={() => {setConceptIdx(1); toggleSound('social');}} style={{ padding: '20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'social' ? '#fff' : 'rgba(255,255,255,0.03)', color: currentSound === 'social' ? '#000' : '#fff' }}><Users size={24} /></button>
            <button onClick={() => {setConceptIdx(2); toggleSound('window');}} style={{ padding: '20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'window' ? '#fff' : 'rgba(255,255,255,0.03)', color: currentSound === 'window' ? '#000' : '#fff' }}><CloudRain size={24} /></button>
          </div>
          {currentSound && <div style={{marginTop: '20px', color: '#f97316', fontSize: '10px', letterSpacing: '2px'}}><Volume2 size={12} style={{display:'inline', marginRight: '5px'}}/>SOUND PLAYING</div>}
        </div>

        {/* 플래너 구역 */}
        <div style={{ width: isMobile ? '100%' : '380px', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(50px)', padding: '40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', opacity: 0.5 }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>PLANNER</span>
          </div>
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '18px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '55px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
          </form>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '25px', marginBottom: '12px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CheckCircle2 size={20} color={todo.done ? "#f97316" : "rgba(255,255,255,0.1)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)' }}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInfo && (
        <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '350px', textAlign: 'center' }}>
          <h3 style={{ color: '#f97316', marginBottom: '20px' }}>뽀모도로 가이드</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.7 }}>
            • 25분 집중, 5분 휴식을 반복합니다.<br/>
            • 4회 집중 후엔 긴 휴식이 시작됩니다.
          </p>
          <button onClick={() => setShowInfo(false)} style={{ marginTop: '30px', padding: '10px 30px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', width: '100%' }}>닫기</button>
        </div>
      )}
    </div>
  );
}