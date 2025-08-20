// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ForgotPassword from "./pages/Login/ForgotPassword/ForgotPassword.jsx";

import Home from "./pages/Home/Home.jsx";
import Todo from "./pages/Todo/Todo.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Pomodoro from "./pages/Pomodoro/Pomodoro.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ResetPassword from "./pages/Login/ResetPass/ResetPassword.jsx";
function AppContent() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isForgotPassword = pathname === "/forgot-password";
  const isResetPassword = pathname === "/reset-password";
  return (
    <>
      {!isLoginPage && !isRegisterPage && !isForgotPassword && !isResetPassword && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
      {!isLoginPage && !isRegisterPage && !isForgotPassword && !isResetPassword && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
