"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2 } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const audioRef = useRef<any>({});

  useEffect(() => {
    audioRef.current = {
      cafe: new Audio("https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3"),
      rain: new Audio("https://www.soundjay.com/nature/sounds/rain-01.mp3")
    };
    audioRef.current.cafe.loop = true;
    audioRef.current.rain.loop = true;
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = mode === 'FOCUS' ? 'REST' : 'FOCUS';
      setMode(nextMode);
      setTimeLeft(nextMode === 'FOCUS' ? 25 * 60 : 5 * 60);
      alert(mode === 'FOCUS' ? "집중 끝! 쉬는 시간입니다." : "휴식 끝! 다시 시작할까요?");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleSound = (type: string) => {
    Object.values(audioRef.current).forEach((a: any) => a.pause());
    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      audioRef.current[type].play().catch(() => alert("화면을 클릭한 후 다시 소리를 켜주세요!"));
      setCurrentSound(type);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      position: 'relative',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* 액체 차오르는 효과 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(61, 43, 31, 0.4)',
        backdropFilter: 'blur(2px)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : 5*60)) * 100}%`,
        transition: 'height 1s linear',
        zIndex: 1
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'row', gap: '40px',
        maxWidth: '1200px', width: '90%', padding: '20px'
      }} className="main-container">
        
        {/* 타이머 섹션 */}
        <div style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
          padding: '60px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', opacity: 0.6, marginBottom: '20px' }}>{mode} MODE</div>
          <div style={{ fontSize: '180px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-5px' }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><RotateCcw size={32}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isActive ? <Pause size={40} color="#000" fill="#000"/> : <Play size={40} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <div style={{ width: '32px' }} />
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '15px' }}>
            <button onClick={() => toggleSound('cafe')} style={{ padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'cafe' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'cafe' ? '#000' : '#fff' }}>
              <Coffee size={24} />
            </button>
            <button onClick={() => toggleSound('rain')} style={{ padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'rain' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'rain' ? '#000' : '#fff' }}>
              <CloudRain size={24} />
            </button>
          </div>
        </div>

        {/* 할 일 목록 섹션 */}
        <div style={{
          width: '380px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
          padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
            <ListTodo color="#f97316" />
            <span style={{ fontSize: '20px', fontWeight: 300 }}>Today's Focus</span>
          </div>

          <form onSubmit={(e:any) => {
            e.preventDefault();
            if(!newTodo) return;
            setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]);
            setNewTodo("");
          }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input 
              value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
              placeholder="할 일을 입력하세요"
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', outline: 'none' }}
            />
            <button style={{ padding: '0 20px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>
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

      <style jsx global>{`
        @media (max-width: 1000px) {
          .main-container { flex-direction: column !important; align-items: center !important; }
          .main-container > div { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
}