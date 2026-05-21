"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Users, CloudRain, ListTodo, CheckCircle2, Trash2, Info, X, Volume2 } from 'lucide-react';

const CONCEPTS = [
  { id: 'focus', name: 'FOCUS', bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000', sound: 'https://cdn.pixabay.com/audio/2022/05/27/audio_180873748b.mp3', desc: '집중 모드: 25분간 한 가지 일에만 몰입합니다.' },
  { id: 'social', name: 'SOCIAL', bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047', sound: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3', desc: '소셜 모드: 사람들의 백색 소음이 창의력을 돕습니다.' },
  { id: 'window', name: 'WINDOW', bg: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070', sound: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', desc: '윈도우 모드: 창밖 빗소리와 함께 차분하게 작업합니다.' }
];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [conceptIdx, setConceptIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK');
  const [session, setSession] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // 단 하나의 오디오 객체로 관리 (가장 에러가 적은 방식)
  const mainAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    mainAudio.current = new Audio();
    mainAudio.current.loop = true;
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

  // 소리 재생 로직 (즉각 재생 방식)
  const toggleSound = (type: string) => {
    if (!mainAudio.current) return;

    if (currentSound === type) {
      mainAudio.current.pause();
      setCurrentSound(null);
    } else {
      // 1. 소리 끄기
      mainAudio.current.pause();
      // 2. 새로운 소리 소스 입력
      const soundUrl = CONCEPTS.find(c => c.id === type)?.sound || "";
      mainAudio.current.src = soundUrl;
      // 3. 로드 및 즉시 재생 (가장 중요)
      mainAudio.current.load();
      const playPromise = mainAudio.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setCurrentSound(type);
        }).catch(error => {
          console.error("재생 실패:", error);
          alert("소리 재생을 위해 화면을 한 번 더 클릭해주세요!");
        });
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // 시작 화면 (이걸 클릭해야 소리 엔진이 풀립니다)
  if (!hasStarted) {
    return (
      <div 
        onClick={() => setHasStarted(true)} 
        style={{ backgroundColor: '#0a0a0a', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', marginBottom: '30px', animation: 'pulse 2s infinite' }}>
          <Play size={60} fill="white" />
        </div>
        <h1 style={{ fontSize: '20px', letterSpacing: '10px', fontWeight: 200 }}>ENTER CAFE</h1>
        <p style={{ marginTop: '20px', opacity: 0.3, fontSize: '12px' }}>화면을 클릭하여 소리 권한을 허용하세요</p>
        <style jsx>{`
          @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${CONCEPTS[conceptIdx].bg})`,
      backgroundSize: 'cover', backgroundPosition: 'center', transition: '1s ease'
    }}>
      {/* 차오르는 커피 효과 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.05)', height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : (mode === 'REST' ? 5*60 : 20*60))) * 100}%`, transition: 'height 1s linear' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%' }} className="main-container">
        
        {/* 타이머 */}
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(50px)', padding: '60px 40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= session ? '#f97316' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.4, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {session}/4</div>
          <div style={{ fontSize: '160px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '60px' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={40} color="#000" fill="#000"/> : <Play size={40} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <button onClick={() => setShowInfo(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Info size={28}/></button>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            {CONCEPTS.map((c, idx) => (
              <button 
                key={c.id}
                onClick={() => {setConceptIdx(idx); toggleSound(c.id);}}
                style={{ padding: '25px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === c.id ? '#fff' : 'rgba(255,255,255,0.03)', color: currentSound === c.id ? '#000' : '#fff', transition: '0.3s' }}
              >
                {c.id === 'focus' && <Coffee size={24} />}
                {c.id === 'social' && <Users size={24} />}
                {c.id === 'window' && <CloudRain size={24} />}
              </button>
            ))}
          </div>
          {currentSound && <div style={{marginTop: '20px', color: '#f97316', fontSize: '10px', letterSpacing: '2px'}}><Volume2 size={12} style={{display:'inline', marginRight: '5px'}}/>SOUND PLAYING</div>}
        </div>

        {/* 플래너 */}
        <div style={{ width: '380px', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(50px)', padding: '40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', opacity: 0.5 }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>PLANNER</span>
          </div>
          {/* 할 일 입력창 및 목록 (기존과 동일) */}
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '18px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '55px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
          </form>
          <div style={{ flex: 1, overflowY: 'auto' }}>
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
    </div>
  );
}