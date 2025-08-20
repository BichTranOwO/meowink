import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import "./Todo.css";

const DAY_TABS = [
  { id: "yesterday", label: "Hôm Qua" },
  { id: "today", label: "Hôm Nay" },
  { id: "tomorrow", label: "Ngày Mai" },
];

export default function Todo() {
  const [active, setActive] = useState("today");
  const [newText, setNewText] = useState("");
  const [tasks, setTasks] = useState({
    yesterday: [],
    today: [],
    tomorrow: [],
  });
  const [showInput, setShowInput] = useState(false);
  const [user, setUser] = useState(null);

  // --- Local Storage ---
  const saveLocalTasks = (newTasks) => {
    localStorage.setItem("tasks_local", JSON.stringify(newTasks));
  };

  const loadLocalTasks = () => {
    const data = localStorage.getItem("tasks_local");
    if (data) return JSON.parse(data);
    return { yesterday: [], today: [], tomorrow: [] };
  };

  // --- Thêm nhiệm vụ ---
  const addTask = async () => {
    if (!newText.trim()) return;

    if (user) {
      // Có đăng nhập → lưu Firestore
      await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        text: newText,
        done: false,
        day: active,
        createdAt: serverTimestamp(),
        createdAtClient: Date.now(),
      });
    } else {
      // Chưa đăng nhập → lưu local
      const newTask = {
        id: Date.now().toString(),
        text: newText,
        done: false,
      };
      const updated = {
  ...tasks,
  [active]: [...tasks[active], newTask],
};
setTasks(updated);
saveLocalTasks(updated);   // ✅ lưu local ngay
    }

    setNewText("");
    setShowInput(false);
  };

  // --- Đánh dấu hoàn thành ---
  const toggleDone = async (tabId, taskId) => {
    if (user) {
      const ref = doc(db, "tasks", taskId);
      const target = tasks[tabId].find((t) => t.id === taskId);
      await updateDoc(ref, { done: !target.done });
    } else {
      const updated = {
        ...tasks,
        [tabId]: tasks[tabId].map((t) =>
          t.id === taskId ? { ...t, done: !t.done } : t
        ),
      };
      setTasks(updated);
      saveLocalTasks(updated);
    }
  };

  // --- Xóa nhiệm vụ ---
  const deleteTask = async (tabId, taskId) => {
    if (user) {
      await deleteDoc(doc(db, "tasks", taskId));
    } else {
      const updated = {
        ...tasks,
        [tabId]: tasks[tabId].filter((t) => t.id !== taskId),
      };
      setTasks(updated);
      saveLocalTasks(updated);
    }
  };

  const tasksLeft = tasks[active].filter((task) => !task.done).length;

  // --- Lắng nghe trạng thái đăng nhập ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  // --- Lắng nghe dữ liệu Firestore hoặc Local ---
  useEffect(() => {
    if (!user) {
      // load lại từ local khi chưa đăng nhập
      setTasks(loadLocalTasks());
      return;
    }

    // Có user → sync Firestore
    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const newTasks = { yesterday: [], today: [], tomorrow: [] };

      snapshot.forEach((d) => {
        const data = d.data();
        if (newTasks[data.day]) {
          newTasks[data.day].push({
            id: d.id,
            text: data.text,
            done: data.done,
          });
        }
      });

      setTasks(newTasks);
    });

    return () => unsubscribeTasks();
  }, [user]);

  return (
    <div className="todo">
      <div className="todo-board__tabs">
        {DAY_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`todo-board__tab ${
              active === tab.id ? "todo-board__tab--active" : ""
            }`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="todo-board__panel fade-in">
        <div className="todo-board__header">
          {active !== "yesterday" && (
            <button
              className="todo-board__btn-add"
              onClick={() => setShowInput(!showInput)}
            >
              {showInput ? "Ẩn" : "Thêm nhiệm vụ"}
            </button>
          )}
        </div>

        {active !== "yesterday" && (
          <div className={`todo-board__input ${showInput ? "active" : ""}`}>
            <input
              type="text"
              placeholder="Nhập nhiệm vụ..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button className="todo__btn-add" onClick={addTask}>
              <i className="fa-solid fa-plus"></i>
              Thêm
            </button>
          </div>
        )}

        <span className="todo-board__count">
          Số nhiệm vụ cần hoàn thành: {tasksLeft}
        </span>

        <ul className="todo-board__list">
          {tasks[active].map((task) => (
            <li
              key={task.id}
              className={`todo-board__item ${
                task.done ? "todo-board__item--done" : ""
              } todo-board__item--animate`}
            >
              <label className="todo-board__item-left">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(active, task.id)}
                />
                <span className="todo-board__item-text">{task.text}</span>
              </label>
              <div className="todo-board__actions">
                <button
                  className="todo-board__btn todo-board__btn--danger"
                  onClick={() => deleteTask(active, task.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
