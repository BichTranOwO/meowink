// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/images/logo_meowink.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import catAvt from "../../assets/images/meo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef();
  const actionsRef = useRef();
  const hamburgerRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setOpenPlus(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header__logo">
        <Link to="/home">
          <img src={logo} alt="Logo Meowink" />
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className={`header__hamburger${mobileMenuOpen ? " is-active" : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        ref={hamburgerRef}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>

      {/* Menu */}
      <ul
        className={`header__menu${mobileMenuOpen ? " header__menu--open" : ""}`}
        ref={menuRef}
      >
        <li>
          <Link to="/home">Trang chủ</Link>
        </li>
        <li>
          <Link to="/todo">Nhiệm vụ</Link>
        </li>
        <li>
          <Link to="/pomodoro">Pomodoro</Link>
        </li>
        <li>
          <Link to="/dashboard">Thống Kê</Link>
        </li>
      </ul>

      {/* Actions */}
      <div className="header__actions">
        {/* Nút + */}
        <div className="header__plus" ref={actionsRef}>
          <button
            id="them"
            onClick={(e) => {
              e.preventDefault();
              setOpenPlus(!openPlus);
            }}
            className="header__toggle--btn"
          >
            <i className="fa-solid fa-plus cong-sang-x" data-open={openPlus} />
          </button>

          {openPlus && (
            <div className="header__dropdown--menu">
              <Link to="/todo" className="dropdown--item">
                <i className="fa-solid fa-plus"></i> Tạo nhiệm vụ
              </Link>
              <Link to="/pomodoro" className="dropdown--item">
                <i className="fa-solid fa-plus"></i> Thêm Pomodoro
              </Link>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="header__user" ref={userRef}>
          {user ? (
            <>
              <img
                src={user?.photoURL || catAvt}
                alt="avatar"
                className="header__user-avatar"
                onClick={() => setOpenUser(!openUser)}
              />

              <div
                className={`header__user-dropdown ${
                  openUser ? "header__user-dropdown--show" : ""
                }`}
              >
                <ul className="header__user-dropdown-list">
                  {/* <li className="header__user-dropdown-item">
                    👤 Hồ sơ cá nhân
                  </li>
                  <li className="header__user-dropdown-item">⚙️ Cài đặt</li> */}
                  <li
                    className="header__user-dropdown-item"
                    onClick={() => signOut(auth)}
                  >
                    🚪 Đăng xuất
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="header__login">
              <Link to="/login" className="header-button--login">
                <i className="fa fa-sign-in-alt"></i> <span>Đăng nhập</span>
              </Link>
              <Link to="/register" className="header-button--register">
                <i className="fa fa-user-plus"></i> <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
