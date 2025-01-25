import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import './App.css';

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success is built on daily habits.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it, work for it.",
  "Your only limit is you.",
  "Make yourself proud.",
  "Strong mind, strong body.",
  "Progress is progress, no matter how small.",
  "Every rep counts, every set matters.",
  "Challenge yourself, change yourself.",
  "What seems impossible today will one day become your warm-up.",
  "You're stronger than you think.",
  "The harder you work, the luckier you get.",
  "Your future self will thank you."
];

const workoutProgram = {
  1: {
    title: 'Upper Body (Pull Focus)',
    exercises: [
      { name: 'Pull-Ups', sets: 4, reps: 'Max' },
      { name: 'Lat Pulldown', sets: 3, reps: '8-12' },
      { name: 'Seated Cable Row', sets: 3, reps: '8-12' },
      { name: 'Reverse Pec Deck', sets: 3, reps: '10-15' },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', videoUrl: 'https://www.youtube.com/watch?v=CFBZ4jN1CMI'},
      { name: 'Triceps Pressdowns (Cable)', sets: 3, reps: '10-12', videoUrl: 'https://www.youtube.com/watch?v=6Fzep104f0s'},
      { name: 'Kosu/Yuruyus', sets: 1, reps: '-' },
      { name: 'Plank', sets: 3, reps: '60-80 saniye' },
    ]
  },
  2: {
    title: 'Full Body Strength',
    exercises: [
      { name: 'Hack Squat', sets: 4, reps: '6-10' },
      { name: 'Deadlift', sets: 4, reps: '6-8', videoUrl: 'https://www.youtube.com/watch?v=ZxL6U_SXnvg'},
      { name: 'Leg Press', sets: 3, reps: '10-12' },
      { name: 'Leg Curl', sets: 3, reps: '10-12' },
      { name: 'Calf Raises', sets: 3, reps: '15-20' },
      { name: "Farmer's Walk", sets: 3, reps: '30-40 metre', videoUrl: 'https://www.youtube.com/watch?v=8OtwXwrJizk'},
      { name: 'Kosu/Yuruyus', sets: 1, reps: '-' },
      { name: 'Plank', sets: 3, reps: '60-80 saniye' },
    ]
  },
  3: {
    title: 'Upper Body (Push Focus)',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '6-10', videoUrl: 'https://www.youtube.com/watch?v=VFbjmiAAwJE'},
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '8-12', videoUrl: 'https://www.youtube.com/watch?v=0JfYxMRsUCQ'},
      { name: 'Dumbbell Lateral Raises', sets: 3, reps: '15-20' },
      { name: 'Pec Deck', sets: 3, reps: '10-15' },
      { name: 'Chest Press', sets: 3, reps: '10' },
      { name: 'Overhead Triceps Extension', sets: 3, reps: '10-12', videoUrl: 'https://www.youtube.com/watch?v=MegBRxtR14I'},
      { name: 'EZ BAR Biceps Curls', sets: 3, reps: '10-12' },
      { name: 'Kosu/Yuruyus', sets: 1, reps: '-' },
      { name: 'Plank', sets: 3, reps: '60-80 saniye' },
    ]
  },
  4: {
    title: 'Lower Body',
    exercises: [
      { name: 'Angled Leg Press', sets: 3, reps: '10-12' },
      { name: 'Walking Lunges', sets: 3, reps: '10-12 per leg' },
      { name: 'Abduction', sets: 3, reps: '12-15' },
      { name: 'Adduction', sets: 3, reps: '12-15' },
      { name: 'Leg Extension', sets: 3, reps: '10-12' },
      { name: 'Box Jumps', sets: 3, reps: '10-12' },
      { name: 'Kosu/Yuruyus', sets: 1, reps: '-' },
      { name: 'Plank', sets: 3, reps: '60-80 saniye' },
    ]
  },
  5: {
    title: 'Shoulder and Core Focus',
    exercises: [
      { name: 'Barbell Overhead Press', sets: 4, reps: '6-10', videoUrl: 'https://www.youtube.com/watch?v=cGnhixvC8uA'},
      { name: 'Dumbbell Arnold Press', sets: 3, reps: '8-12', videoUrl: 'https://www.youtube.com/watch?v=pQDrcNoDNVM'},
      { name: 'Cable Lateral Raises', sets: 3, reps: '15-20', videoUrl: 'https://www.youtube.com/watch?v=Z5FA9aq3L6A'},
      { name: 'Face pulls', sets: 3, reps: '15-20', videoUrl: 'https://www.youtube.com/watch?v=0Po47vvj9g4'},
      { name: 'Dumbbell Shrugs', sets: 3, reps: '10-12', videoUrl: 'https://www.youtube.com/watch?v=llSrlpd7TEE'},
      { name: 'Kosu/Yuruyus', sets: 1, reps: '-' },
      { name: 'Hanging Leg Raise', sets: 3, reps: '10-12' },
      { name: 'Plank', sets: 3, reps: '60-80 saniye' },
    ]
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [selectedSummaryDay, setSelectedSummaryDay] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [isTestUser, setIsTestUser] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı giriş yaptığında rastgele bir motivasyon cümlesi seç
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setMotivationalQuote(randomQuote);
        
        // Önce test kullanıcısı kontrolü yap
        if (user.email === 'test@example.com') {
          console.log('Test user logged in');
          setUser(user);
          setIsAdmin(true);
          setIsTestUser(true);
          setLoading(false);
          return; // Diğer kontrolleri yapma
        }

        // Normal kullanıcılar için admin kontrolü
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            console.log('Admin user logged in');
            setUser(user);
            setIsAdmin(true);
          } else {
            console.log('Non-admin user, logging out');
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Admin kontrolü yapılırken hata:", error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log('No user logged in');
        setUser(null);
        setIsAdmin(false);
        setIsTestUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Verileri yükle
  useEffect(() => {
    if (!user) return;
    if (isTestUser) return; // Test kullanıcısı için veri yükleme yapma

    const loadData = async () => {
      try {
        const workoutDoc = await getDoc(doc(db, `users/${user.uid}/workouts`, 'latest'));
        const historyDoc = await getDoc(doc(db, `users/${user.uid}/workouts`, 'history'));
        
        if (workoutDoc.exists()) {
          const data = workoutDoc.data();
          setCompletedExercises(data.completedExercises || {});
          setExerciseLogs(data.exerciseLogs || {});
        }
        
        if (historyDoc.exists()) {
          setWorkoutHistory(historyDoc.data() || {});
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [user, isTestUser]); // isTestUser'ı dependency array'e ekleyin

  // Verileri kaydet
  const saveData = async () => {
    if (!user || isTestUser) return; // Test kullanıcısı için kaydetme

    try {
      await setDoc(doc(db, `users/${user.uid}/workouts`, 'latest'), {
        completedExercises,
        exerciseLogs
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert('Veri kaydedilirken bir hata oluştu');
    }
  };

  const toggleExercise = (dayId, exerciseName) => {
    const key = `${dayId}-${exerciseName}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExerciseCompleted = (dayId, exerciseName) => {
    const key = `${dayId}-${exerciseName}`;
    return completedExercises[key] || false;
  };

  const saveExerciseLog = (dayId, exerciseName, log, field) => {
    const key = `${dayId}-${exerciseName}`;
    
    // Ağırlık için sadece sayı ve nokta kontrolü
    if (field === 'weight') {
      // Sadece sayılar ve nokta karakterine izin ver
      if (!/^[\d.]*$/.test(log.weight)) return;
      // Birden fazla nokta kullanımını engelle
      if ((log.weight.match(/\./g) || []).length > 1) return;
    }
    
    // Tekrarlar için sadece sayı kontrolü
    if (field === 'reps') {
      if (!/^\d*$/.test(log.reps)) return;
    }

    setExerciseLogs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...log
      }
    }));
  };

  const getExerciseLog = (dayId, exerciseName) => {
    const key = `${dayId}-${exerciseName}`;
    return exerciseLogs[key] || { weight: '', reps: '' };
  };

  const completeWorkout = async (dayId) => {
    if (isTestUser) {
      // Test kullanıcısı için sadece state'i temizle
      setExerciseLogs({});
      setCompletedExercises({});
      setSelectedDay(null);
      return;
    }

    const exercises = workoutProgram[dayId].exercises;
    const logs = {};
    exercises.forEach(exercise => {
      const key = `${dayId}-${exercise.name}`;
      logs[exercise.name] = exerciseLogs[key] || { weight: '-', reps: '-' };
    });

    const date = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('tr-TR');

    // Geçmiş kayıtlara ekle
    const historyKey = `${dayId}-${date}`;
    const updatedHistory = {
      ...workoutHistory,
      [historyKey]: {
        dayId,
        date: formattedDate,
        logs
      }
    };

    try {
      // Geçmiş kayıtları güncelle
      await setDoc(doc(db, `users/${user.uid}/workouts`, 'history'), updatedHistory);
      
      // Aktif kayıtları temizle
      const clearedExerciseLogs = {};
      const clearedCompletedExercises = {};
      Object.keys(exerciseLogs).forEach(key => {
        if (!key.startsWith(dayId)) {
          clearedExerciseLogs[key] = exerciseLogs[key];
        }
      });
      Object.keys(completedExercises).forEach(key => {
        if (!key.startsWith(dayId)) {
          clearedCompletedExercises[key] = completedExercises[key];
        }
      });

      // Güncel durumu kaydet
      await setDoc(doc(db, `users/${user.uid}/workouts`, 'latest'), {
        completedExercises: clearedCompletedExercises,
        exerciseLogs: clearedExerciseLogs
      });

      // State'leri güncelle
      setWorkoutHistory(updatedHistory);
      setExerciseLogs(clearedExerciseLogs);
      setCompletedExercises(clearedCompletedExercises);
      setSelectedDay(null);
    } catch (error) {
      console.error("Error saving workout:", error);
      alert('Antrenman kaydedilirken bir hata oluştu');
    }
  };

  const renderExerciseList = (exercises, dayId) => {
    const allExercisesCompleted = exercises.every(exercise => 
      isExerciseCompleted(dayId, exercise.name)
    );

    return (
      <div className="exercise-list">
        {exercises.map((exercise, index) => {
          const log = getExerciseLog(dayId, exercise.name);
          
          return (
            <div key={index} className="exercise-item">
              <div className="exercise-content">
                <div className="exercise-header">
                  <input
                    type="checkbox"
                    checked={isExerciseCompleted(dayId, exercise.name)}
                    onChange={() => toggleExercise(dayId, exercise.name)}
                    className="exercise-checkbox"
                  />
                  <h3 className={isExerciseCompleted(dayId, exercise.name) ? 'completed' : ''}>
                    {exercise.name}
                  </h3>
                </div>
                <p>
                  {exercise.sets} set x {exercise.reps} tekrar
                </p>
                <div className="exercise-log">
                  <div className="log-inputs">
                    <input
                      type="text"
                      placeholder="Ağırlık (kg)"
                      value={log.weight}
                      onChange={(e) => saveExerciseLog(dayId, exercise.name, 
                        { ...log, weight: e.target.value }, 'weight')}
                      className="log-input"
                    />
                    <input
                      type="text"
                      placeholder="Yapılan tekrarlar"
                      value={log.reps}
                      onChange={(e) => saveExerciseLog(dayId, exercise.name, 
                        { ...log, reps: e.target.value }, 'reps')}
                      className="log-input"
                    />
                  </div>
                </div>
                {exercise.videoUrl && (
                  <a 
                    href={exercise.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    Nasıl Yapılır? (Video)
                  </a>
                )}
              </div>
            </div>
          );
        })}
        <div className="workout-actions">
          <button 
            className="save-button"
            onClick={saveData}
          >
            Kaydet
          </button>
          {allExercisesCompleted && (
            <button 
              className="complete-workout-button"
              onClick={() => completeWorkout(dayId)}
            >
              Antrenmanı Tamamla
            </button>
          )}
        </div>
      </div>
    );
  };

  const WorkoutHistory = ({ dayId }) => {
    // Son 30 günün kayıtlarını filtrele ve sırala
    const filteredHistory = Object.entries(workoutHistory)
      .filter(([key]) => key.startsWith(dayId))
      .map(([key, value]) => ({
        id: key,
        ...value
      }))
      .sort((a, b) => new Date(b.id.split('-')[1]) - new Date(a.id.split('-')[1]))
      .slice(0, 30);

    const [selectedWorkout, setSelectedWorkout] = useState(null);

    return (
      <div className="history-modal">
        <div className="history-content">
          <h3>Gün {dayId} - Geçmiş Antrenmanlar</h3>
          {selectedWorkout ? (
            <div className="workout-detail">
              <div className="workout-detail-header">
                <h4>{selectedWorkout.date}</h4>
                <button onClick={() => setSelectedWorkout(null)}>
                  Listeye Dön
                </button>
              </div>
              <div className="workout-detail-exercises">
                {Object.entries(selectedWorkout.logs).map(([name, log]) => (
                  <div key={name} className="workout-detail-exercise">
                    <h5>{name}</h5>
                    <p>Ağırlık: {log.weight} kg</p>
                    <p>Tekrarlar: {log.reps}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="workout-history-list">
              {filteredHistory.map((workout) => (
                <button
                  key={workout.id}
                  className="workout-history-item"
                  onClick={() => setSelectedWorkout(workout)}
                >
                  {workout.date}
                </button>
              ))}
              {filteredHistory.length === 0 && (
                <p className="no-history">Henüz kayıtlı antrenman bulunmuyor.</p>
              )}
            </div>
          )}
          <button 
            className="close-history" 
            onClick={() => setShowWorkoutSummary(false)}
          >
            Kapat
          </button>
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!user || !isAdmin) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Antrenman Takip Programı</h1>
          <div className="header-right">
            {isTestUser && (
              <span className="test-user-badge">Test Hesabı</span>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>
      {motivationalQuote && (
        <div className="motivational-quote">
          {motivationalQuote}
        </div>
      )}
      <main className="App-main">
        {!selectedDay ? (
          <div className="days-container">
            {Object.keys(workoutProgram).map((day) => {
              const totalExercises = workoutProgram[day].exercises.length;
              const completedCount = workoutProgram[day].exercises.filter(
                ex => isExerciseCompleted(day, ex.name)
              ).length;

              // Geçmiş kayıtları filtrele
              const dayHistory = Object.entries(workoutHistory)
                .filter(([key]) => key.startsWith(day))
                .sort((a, b) => new Date(b[0].split('-')[1]) - new Date(a[0].split('-')[1]));

              return (
                <div key={day} className="day-wrapper">
                  <div className="day-header">
                    <h2>Gün {day}</h2>
                    <div className="day-subtitle">{workoutProgram[day].title}</div>
                  </div>
                  <div className="day-buttons">
                    <button
                      className="start-workout-button"
                      onClick={() => setSelectedDay(day)}
                    >
                      Antrenmanı Başlat
                      <div className="button-progress">
                        {completedCount}/{totalExercises} tamamlandı
                      </div>
                    </button>
                    {dayHistory.length > 0 && (
                      <button 
                        className="view-history-button"
                        onClick={() => {
                          setSelectedSummaryDay(day);
                          setShowWorkoutSummary(true);
                        }}
                      >
                        Geçmiş Kayıtlar
                        <div className="history-count">
                          {dayHistory.length} kayıt
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="workout-container">
            <h2>{`Gün ${selectedDay}: ${workoutProgram[selectedDay].title}`}</h2>
            {renderExerciseList(workoutProgram[selectedDay].exercises, selectedDay)}
            <button 
              className="back-button"
              onClick={() => setSelectedDay(null)}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        )}
      </main>
      {showWorkoutSummary && <WorkoutHistory dayId={selectedSummaryDay} />}
    </div>
  );
}

export default App;
