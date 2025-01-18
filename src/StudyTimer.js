// src/StudyTimer.js
import React, { useState, useRef, useEffect } from "react";

const categories = ["수학", "영어", "개발"];

const StudyTimer = () => {
  // 선택한 과목 상태
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  // 현재 타이머(초 단위)
  const [currentTime, setCurrentTime] = useState(0);
  // 누적 공부 시간(분 단위, 각 과목별로 저장)
  const [accumulatedTimes, setAccumulatedTimes] = useState({
    수학: 0,
    영어: 0,
    개발: 0,
  });
  // 공부 중인지 여부 (재생/일시정지)
  const [isRunning, setIsRunning] = useState(false);
  // 타이머 interval ID 저장 (useRef로 관리하여 컴포넌트 리렌더링 시 유지)
  const timerInterval = useRef(null);

  // "카테고리 선택" 변경 시 타이머 초기화 (혹은 현재 타이머는 그대로, 누적 값은 별도 유지)
  const handleCategoryChange = (e) => {
    // 과목 전환 시에는 현재 공부 중이면 일시정지하는 것이 좋습니다.
    if (isRunning) {
      handleStop();
    }
    setSelectedCategory(e.target.value);
    // 현재 시간 초기화
    setCurrentTime(0);
  };

  // 재생 버튼 클릭 시
  const handleStart = () => {
    if (isRunning) return; // 이미 실행 중이면 무시

    setIsRunning(true);
    // 1초마다 currentTime 업데이트
    timerInterval.current = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  // 일시정지 버튼 클릭 시
  const handleStop = () => {
    if (!isRunning) return;

    clearInterval(timerInterval.current);
    setIsRunning(false);

    // 현재 초 단위를 분으로 변환하여 누적 시간에 추가
    setAccumulatedTimes((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] + Math.floor(currentTime / 60),
    }));

    // 타이머는 재시작 시 0초부터 시작하도록 초기화
    setCurrentTime(0);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => clearInterval(timerInterval.current);
  }, []);

  return (
    <div style={styles.container}>
      <h1>공부 시간 측정</h1>
      {/* 카테고리 선택 */}
      <div style={styles.row}>
        <label style={styles.label}>과목 선택: </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={styles.select}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 타이머 표시 */}
      <div style={styles.timerBox}>
        <h2>현재 공부 시간: {currentTime}초</h2>
      </div>

      {/* 재생 및 일시정지 버튼 */}
      <div style={styles.buttonRow}>
        <button onClick={handleStart} style={styles.button}>
          재생
        </button>
        <button onClick={handleStop} style={styles.button}>
          일시정지
        </button>
      </div>

      {/* 누적 공부 시간 표시 */}
      <div style={styles.accumulatedBox}>
        <h2>누적 공부 시간 (분)</h2>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              {category}: {accumulatedTimes[category]}분
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  row: {
    marginBottom: "20px",
  },
  label: {
    marginRight: "10px",
    fontSize: "18px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
  },
  timerBox: {
    marginBottom: "20px",
  },
  buttonRow: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "0 10px",
    cursor: "pointer",
  },
  accumulatedBox: {
    marginTop: "30px",
    textAlign: "left",
  },
};

export default StudyTimer;
