import React, { useState, useEffect, useRef } from 'react';
import './Pomodoro.css';
import { auth, db } from "../../firebase/config";
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

const Pomodoro = () => {
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);

  const modes = {
    pomodoro: { label: 'Pomodoro', duration: 25 * 60, color: '#f87070' },
    shortBreak: { label: 'Short Break', duration: 5 * 60, color: '#709df8ff' },
    longBreak: { label: 'Long Break', duration: 15 * 60, color: '#e94fc5ff' }
  };

  // 🔹 Load dữ liệu từ Firestore khi user login
  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPomodoroCount(data.pomodoroCount || 0);
      } else {
        // nếu chưa có thì tạo mới
        await setDoc(userRef, { pomodoroCount: 0 }, { merge: true });
      }
    };
    loadData();
  }, []);

  // 🔹 Reset khi đổi mode
  useEffect(() => {
    setTimeLeft(modes[mode].duration);
    if (isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
    }
  }, [mode]);

  // 🔹 Countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(intervalRef.current);
      handleTimerEnd();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  // 🔹 Lưu vào Firestore khi kết thúc Pomodoro
  const savePomodoroToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      pomodoroCount: increment(1)
    });
  };

  const handleTimerEnd = () => {
    const audio = new Audio('https://www.myinstants.com/fr/instant/30-mins-40603/?utm_source=copy&utm_medium=share');
    audio.play();
    
    if (mode === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      savePomodoroToFirestore(); // 🔹 lưu vào DB
      setMode(newCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      setMode('pomodoro');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const skipTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    if (mode === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      savePomodoroToFirestore(); // 🔹 lưu vào DB
      setMode(newCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      setMode('pomodoro');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * circumference;

  return (
    <div className="pomodoro" style={{ '--active-color': modes[mode].color }}>
      {/* Mode selector */}
      <div className="pomodoro__mode-selector">
        {Object.keys(modes).map(key => (
          <button
            key={key}
            className={`pomodoro__mode-btn ${mode === key ? 'pomodoro__mode-btn--active' : ''}`} 
            onClick={() => setMode(key)}
          >
            {modes[key].label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="pomodoro__timer-container">
        <svg className="pomodoro__progress-ring" width="340" height="340">
          <circle
            className="pomodoro__progress-bg"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="170"
            cy="170"
          />
          <circle
            className="pomodoro__progress-circle"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            fill="transparent"
            r={radius}
            cx="170"
            cy="170"
          />
        </svg>
        <div className="pomodoro__display">
          <h1 className="pomodoro__time">{formatTime(timeLeft)}</h1>
          <p className="pomodoro__mode-label">{modes[mode].label}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="pomodoro__controls">
        <button className="pomodoro__control-btn" onClick={toggleTimer}>
          {isActive ? 'Dừng lại' : 'Bắt đầu'}
        </button>
        <button className="pomodoro__control-btn" onClick={resetTimer}>
          Đặt lại
        </button>
        <button className="pomodoro__control-btn" onClick={skipTimer}>
          Bỏ qua
        </button>
      </div>

      <div className="pomodoro__counter">
        <p className="pomodoro__counter-text">Pomodoro completed: {pomodoroCount}</p>
      </div>
    </div>
  );
};

export default Pomodoro;
