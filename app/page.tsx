"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Users, CloudRain, ListTodo, CheckCircle2, Trash2, Info, X } from 'lucide-react';

const CONCEPTS = [
  { id: 'focus', name: 'FOCUS', bg: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2000', sound: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', desc: '집중 모드: 25분간 한 가지 일에만 몰입합니다.' },
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
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // 오디오 객체를 미리 할당
  const audioFocus = useRef<HTMLAudioElement | null>(null);
  const audioSocial = useRef<HTMLAudioElement | null>(null);
  const audioWindow = useRef<HTMLAudioElement | null>(null);

  const handleStart = async () => {
    // 시작 버튼을 누를 때 모든 오디오를 초기화 및 '해제'
    const a1 = new Audio(CONCEPTS[0].sound); a1.loop = true; audioFocus.current = a1;
    const a2 = new Audio(CONCEPTS[1].sound); a2.loop = true; audioSocial.current = a2;
    const a3 = new Audio(CONCEPTS[2].sound); a3.loop = true; audioWindow.current = a3;

    // 브라우저 권한 획득을 위해 아주 잠깐 재생 후 정지
    [a1, a2, a3].forEach(a => {
      a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    });
    
    setHasStarted(true);
  };

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const isWork = mode === 'WORK';
      const nextMode = isWork ? (session < 4 ? 'REST' : 'LONG_REST') : 'WORK';
      if (isWork) setSession(s => s < 4 ? s + 1 : 1);
      setMode(nextMode);
      setTimeLeft(nextMode === 'WORK' ? 25 * 60 : (nextMode === 'REST' ? 5 * 60 : 20 * 60));
      alert(isWork ? "Focus done! Time to rest." : "Rest over! Back to work.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, session]);

  const toggleSound = (id: string) => {
    // 모든 소리 끄기
    [audioFocus, audioSocial, audioWindow].forEach(ref => ref.current?.pause());

    if (currentSound === id) {
      setCurrentSound(null);
    } else {
      const target = id === 'focus' ? audioFocus : id === 'social' ? audioSocial : audioWindow;
      target.current?.play().catch(() => alert("소리 재생에 실패했습니다. 다시 클릭해주세요."));
      setCurrentSound(id);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!hasStarted) {
    return (
      <div onClick={handleStart} style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', padding: '20px' }}>
        <div style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', marginBottom: '20px' }}>
          <Play size={40} fill="white" />
        </div>
        <h1 style={{ fontSize: '20px', letterSpacing: '10px', fontWeight: 200 }}>OPEN CAFE</h1>
        <p style={{ marginTop: '10px', opacity: 0.3, fontSize: '12px' }}>화면을 클릭하면 소리와 타이머가 활성화됩니다</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${CONCEPTS[conceptIdx].bg})`,
      backgroundSize: 'cover', backgroundPosition: 'center', transition: '1s ease'
    }}>
      {/* 뽀모도로 진행 상태 바 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.05)', height: `${(1 - timeLeft / (mode === 'WORK' ? 25*60 : (mode === 'REST' ? 5*60 : 20*60))) * 100}%`, transition: 'height 1s linear' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%' }} className="main-container">
        
        {/* 타이머 구역 */}
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(40px)', padding: '60px 40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= session ? '#f97316' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.4, marginBottom: '10px', fontWeight: 'bold' }}>{mode} {session}/4</div>
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
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
        </div>

        {/* 플래너 구역 */}
        <div style={{ width: '380px', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(40px)', padding: '40px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', opacity: 0.6 }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>PLANNER</span>
          </div>
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
          </form>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '25px', marginBottom: '10px' }}>
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
        <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '350px' }}>
          <h3 style={{ color: '#f97316', marginBottom: '20px' }}>뽀모도로 가이드</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.8', opacity: 0.7 }}>
            • <strong>FOCUS:</strong> 25분 집중 시간입니다.<br/>
            • <strong>REST:</strong> 5분(짧게) 혹은 20분(길게) 휴식합니다.<br/>
            • <strong>세션:</strong> 4회 집중 후엔 자동으로 긴 휴식이 시작됩니다.
          </p>
          <button onClick={() => setShowInfo(false)} style={{ marginTop: '30px', padding: '10px 30px', borderRadius: '20px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>알겠습니다</button>
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