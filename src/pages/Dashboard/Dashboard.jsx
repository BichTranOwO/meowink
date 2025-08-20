// src/components/DashboardStats.jsx
import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  // Dữ liệu giả  :>>
  const fakeData = {
    totalTodos: 12,
    doneTodos: 7,
    overdueTodos: 2,
    doneRate: 58,
    totalSessions: 14,
    focusMinutesThisWeek: 250,
    donePerDay7: [1, 0, 2, 1, 0, 2, 1],
    sessionsPerDay7: [2, 1, 0, 3, 2, 1, 5],
    days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  };
 function ProgressBar({ percent, color = "#001858" }) {
  return (
    <div className="progress">
      <div
        className="progress__fill"
        style={{ width: `${percent}%`, background: color }}
      >
        <span className="progress__text">{percent}%</span>
      </div>
    </div>
  );
}
  return (
    <div className="stats">
      <h2 className="stats__title">📊 Thống Kê ToDo + Pomodoro</h2>

      <div className="stats__cards">
        <div className="stats__card">
          <p>Tổng nhiệm vụ</p>
          <h3>{fakeData.totalTodos}</h3>
        </div>
        <div className="stats__card">
          <p>Đã hoàn thành</p>
          <h3>{fakeData.doneTodos}</h3>
          {/* <span>{fakeData.doneRate}%</span>
           */}
          <ProgressBar percent={fakeData.doneRate} color="#4caf50" />
        </div>
        <div className="stats__card">
          <p>Quá hạn</p>
          <h3>{fakeData.overdueTodos}</h3>
        </div>
        <div className="stats__card">
          <p>Pomodoro</p>
          <h3>{fakeData.totalSessions}</h3>
          <span>{fakeData.focusMinutesThisWeek} phút</span>
        </div>
      </div>

      {/* Charts */}
      <div className="stats__charts">
        {/* Todo chart */}
        <div className="stats__chart">
          <h4>Todo hoàn thành (7 ngày)</h4>
          <div className="chart__bars">
            {fakeData.donePerDay7.map((v, i) => (
              <div key={i} className="bar">
                <div
                  className="bar__fill"
                  style={{ height: `${v * 20}px` }}
                  title={`${v} todo`}
                ></div>
                <span className="bar__label">{fakeData.days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pomodoro chart */}
        <div className="stats__chart">
          <h4>Phiên Pomodoro (7 ngày)</h4>
          <div className="chart__bars">
            {fakeData.sessionsPerDay7.map((v, i) => (
              <div key={i} className="bar">
                <div
                  className="bar__fill bar__fill--pomo"
                  style={{ height: `${v * 20}px` }}
                  title={`${v} phiên`}
                ></div>
                <span className="bar__label">{fakeData.days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
