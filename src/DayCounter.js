// src/DayCounter.js
import React, { useState } from "react";

const DayCounter = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [remainingDays, setRemainingDays] = useState(null);

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const calculateDDay = () => {
    if (!selectedDate) {
      setRemainingDays(null);
      return;
    }
    const now = new Date();
    // 선택한 날짜의 시간을 0시 0분 0초로 설정 (시간에 따른 오차 방지)
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    // 밀리초를 일수로 변환 (1일 = 24*60*60*1000)
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    setRemainingDays(diffInDays);
  };

  return (
    <div style={styles.container}>
      <h1>디데이 설정하기</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        style={styles.dateInput}
      />
      <button onClick={calculateDDay} style={styles.button}>
        계산하기
      </button>
      {selectedDate && remainingDays !== null && (
        <h2>
          {selectedDate}까지 {remainingDays}일 남았습니다.
        </h2>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    maxWidth: "400px",
    margin: "40px auto",
  },
  dateInput: {
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default DayCounter;
