"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, Users, Info, X } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS'); // FOCUS, REST
  const [sessionCount, setSessionCount] = useState(1);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  
  // 사용자님 코드의 핵심: 개별 오디오 객체 미리 생성 (구글 서버 이용)
  const audioFocus = useRef<HTMLAudioElement | null>(null);
  const audioSocial = useRef<HTMLAudioElement | null>(null);
  const audioWindow = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 가장 소리가 잘 났던 구글 안정 링크들
    audioFocus.current = new Audio("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
    audioSocial.current = new Audio("https://actions.google.com/sounds/v1/crowds/crowd_talking.ogg");
    audioWindow.current = new Audio("https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg");
    
    [audioFocus, audioSocial, audioWindow].forEach(ref => {
      if (ref.current) ref.current.loop = true;
    });

    return () => {
      [audioFocus, audioSocial, audioWindow].forEach(ref => ref.current?.pause());
    };
  }, []);

  // 타이머 로직 + 뽀모도로 사이클 (25분/5분/20분)
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
    if (mode === 'FOCUS') {
      if (sessionCount < 4) {
        setMode('REST'); setTimeLeft(5 * 60);
        alert(`${sessionCount}번째 집중 완료! 5분간 휴식하세요.`);
      } else {
        setMode('LONG REST'); setTimeLeft(20 * 60);
        alert(`4회 집중 완료! 20분간 긴 휴식을 취하세요.`);
      }
      setSessionCount(prev => prev < 4 ? prev + 1 : 1);
    } else {
      setMode('FOCUS'); setTimeLeft(25 * 60);
      alert("휴식 끝! 다시 집중을 시작합니다.");
    }
  };

  const toggleSound = (type: string) => {
    // 모든 소리 일단 정지
    [audioFocus, audioSocial, audioWindow].forEach(ref => ref.current?.pause());

    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      const target = type === 'focus' ? audioFocus : type === 'social' ? audioSocial : audioWindow;
      target.current?.play().catch(() => alert("화면을 클릭한 후 다시 시도해주세요!"));
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      backgroundColor: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078')`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      {/* 액체 차오르는 효과 (갈색) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(92, 64, 51, 0.3)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : (sessionCount === 1 && mode !== 'FOCUS' ? 20*60 : 5*60))) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', gap: '40px', maxWidth: '1100px', width: '90%', padding: '20px' }}>
        
        {/* [왼쪽] 타이머 섹션 */}
        <div style={{
          flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)',
          padding: '60px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          {/* 세션 카운터 (점 4개) */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= sessionCount ? '#f97316' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.5, marginBottom: '20px', fontWeight: 'bold' }}>{mode} {sessionCount}/4</div>
          <div style={{ fontSize: '150px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-10px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false); setSessionCount(1);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={32}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={36} color="#000" fill="#000"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <button onClick={() => setShowInfo(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Info size={32}/></button>
          </div>

          {/* 3가지 컨셉 버튼 */}
          <div style={{ marginTop: '50px', display: 'flex', gap: '15px' }}>
            <button onClick={() => toggleSound('focus')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'focus' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'focus' ? '#000' : '#fff' }} title="Cafe Focus">
              <Coffee size={24} />
            </button>
            <button onClick={() => toggleSound('social')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'social' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'social' ? '#000' : '#fff' }} title="Social Crowd">
              <Users size={24} />
            </button>
            <button onClick={() => toggleSound('window')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'window' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'window' ? '#000' : '#fff' }} title="Rainy Window">
              <CloudRain size={24} />
            </button>
          </div>
        </div>

        {/* [오른쪽] 할 일 목록 */}
        <div style={{ width: '350px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', opacity: 0.5 }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300 }}>PLANNER</span>
          </div>
          <form onSubmit={(e:any) => { e.preventDefault(); if(!newTodo) return; setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]); setNewTodo(""); }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Task..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' }} />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
          </form>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', marginBottom: '10px' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CheckCircle2 size={18} color={todo.done ? "#f97316" : "rgba(255,255,255,0.2)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8 }}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 뽀모도로 가이드 모달 */}
      {showInfo && (
        <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ color: '#f97316', margin: 0 }}>GUIDE</h3>
            <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', opacity: 0.7 }}>
            <strong>1. FOCUS:</strong> 25분간 한 업무에만 집중합니다.<br/>
            <strong>2. REST:</strong> 5분간 짧은 휴식을 취합니다.<br/>
            <strong>3. CYCLE:</strong> 4회 집중 후 20분간 긴 휴식을 가집니다.
          </p>
        </div>
      )}
    </div>
  );
}