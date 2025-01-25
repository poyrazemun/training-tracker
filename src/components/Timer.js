import React, { useState, useEffect } from 'react';

const Timer = ({ defaultTime = 90 }) => {
  const [time, setTime] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  return (
    <div className="timer">
      <div className="time">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Duraklat' : 'Başlat'}
      </button>
    </div>
  );
};

export default Timer; 