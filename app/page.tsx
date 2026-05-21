"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, CloudRain, ListTodo, CheckCircle2, Trash2, Volume2 } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS');
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  // 브라우저 기본 오디오 객체 사용 (가장 확실한 방법)
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const rainAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 구글 서버의 안정적인 사운드 파일로 교체
    cafeAudio.current = new Audio("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
    cafeAudio.current.loop = true;
    
    rainAudio.current = new Audio("https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg");
    rainAudio.current.loop = true;

    return () => {
      cafeAudio.current?.pause();
      rainAudio.current?.pause();
    };
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
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleSound = (type: string) => {
    // 일단 모든 소리 정지
    cafeAudio.current?.pause();
    rainAudio.current?.pause();

    if (currentSound === type) {
      setCurrentSound(null);
    } else {
      const target = type === 'cafe' ? cafeAudio.current : rainAudio.current;
      
      // 브라우저 정책 때문에 play()는 반드시 '사용자 클릭' 안에서 실행되어야 함
      if (target) {
        target.play()
          .then(() => {
            setCurrentSound(type);
          })
          .catch((error) => {
            console.error("재생 실패:", error);
            alert("소리를 켜려면 화면을 아무 곳이나 한 번 클릭한 뒤 다시 눌러주세요!");
          });
      }
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
      backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078')`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      {/* 액체 차오르는 효과 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(92, 64, 51, 0.3)', backdropFilter: 'blur(3px)',
        height: `${(1 - timeLeft / (mode === 'FOCUS' ? 25*60 : 5*60)) * 100}%`,
        transition: 'height 1s linear', zIndex: 1
      }} />

      <div style={{
        position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', 
        gap: '40px', maxWidth: '1100px', width: '90%', padding: '20px'
      }} className="main-container">
        
        {/* 타이머 섹션 */}
        <div style={{
          flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)',
          padding: '60px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '12px', letterSpacing: '6px', opacity: 0.5, marginBottom: '20px', fontWeight: 'bold' }}>{mode} MODE</div>
          <div style={{ fontSize: '160px', fontWeight: 100, marginBottom: '40px', letterSpacing: '-8px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => {setTimeLeft(25*60); setIsActive(false);}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><RotateCcw size={28}/></button>
            <button onClick={() => setIsActive(!isActive)} style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
              {isActive ? <Pause size={36} color="#000" fill="#000"/> : <Play size={36} color="#000" fill="#000" style={{ marginLeft: '5px' }}/>}
            </button>
            <div style={{ width: '28px' }} />
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', items: 'center', gap: '8px' }}>
              <button onClick={() => toggleSound('cafe')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'cafe' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'cafe' ? '#000' : '#fff', transition: '0.3s' }}>
                <Coffee size={24} />
              </button>
              <span style={{ fontSize: '10px', textAlign: 'center', opacity: 0.4 }}>CAFE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', items: 'center', gap: '8px' }}>
              <button onClick={() => toggleSound('rain')} style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: currentSound === 'rain' ? '#fff' : 'rgba(255,255,255,0.05)', color: currentSound === 'rain' ? '#000' : '#fff', transition: '0.3s' }}>
                <CloudRain size={24} />
              </button>
              <span style={{ fontSize: '10px', textAlign: 'center', opacity: 0.4 }}>RAIN</span>
            </div>
          </div>
          {currentSound && <div style={{marginTop: '20px', fontSize: '12px', color: '#f97316', animate: 'pulse'}} className="animate-pulse">● Sound Playing</div>}
        </div>

        {/* 할 일 목록 섹션 */}
        <div style={{
          width: '350px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)',
          padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <ListTodo color="#f97316" size={20} />
            <span style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '1px' }}>TODAY'S FOCUS</span>
          </div>

          <form onSubmit={(e:any) => {
            e.preventDefault();
            if(!newTodo) return;
            setTodos([{id: Date.now(), text: newTodo, done: false}, ...todos]);
            setNewTodo("");
          }} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input 
              value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a task..."
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none', fontSize: '14px' }}
            />
            <button style={{ width: '50px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
            {todos.map(todo => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '18px', borderRadius: '20px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <CheckCircle2 size={20} color={todo.done ? "#f97316" : "rgba(255,255,255,0.1)"} />
                </button>
                <span style={{ fontSize: '14px', flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.3 : 0.8, fontWeight: 300 }}>{todo.text}</span>
                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @media (max-width: 1000px) {
          .main-container { flex-direction: column !important; align-items: center !important; height: auto !important; }
          .main-container > div { width: 100% !important; box-sizing: border-box; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}