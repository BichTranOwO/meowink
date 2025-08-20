import React, { useState, useRef, useEffect } from "react";
import "./Register.css";
import catOpen from "../../assets/images/meo-tach-ne.png";
import catClose from "../../assets/images/meo-che-mat-tach-nen.png";
import { Link, useNavigate } from "react-router-dom"; // 👈 dùng để chuyển trang
import { auth } from "../../firebase/config"; // 👈 import từ config.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState("register__cat-img--fade-in");
  const [cat, setCat] = useState(catOpen);
  const passwordRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // 🟢 Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Đăng ký thành công 🎉");
      navigate("/login"); // 👈 chuyển sang trang login
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("🐾 Email này đã được đăng ký rồi, hãy đăng nhập nhé!");
      } else {
        setError("Lỗi: " + err.message);
      }
    }
    setLoading(false);
  };

  const changeCat = (newCat) => {
    if (newCat === cat) return; // tránh đổi ảnh giống nhau gây giật
    setAnimation("register__cat-img--fade-out");
    setTimeout(() => {
      setCat(newCat);
      setAnimation("register__cat-img--fade-in");
    }, 150);
  };

  const handleFocus = () => {
    if (password.length > 0 && !showPassword) {
      changeCat(catClose);
    }
  };

  const handleBlur = () => {
    changeCat(catOpen);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length === 0) {
      changeCat(catOpen);
    } else if (!showPassword) {
      changeCat(catClose);
    } else {
      changeCat(catOpen);
    }
  };

  const toggleShowPassword = () => {
    const newShow = !showPassword;
    setShowPassword(newShow);

    if (newShow) {
      changeCat(catOpen);
    } else {
      if (password.length > 0) {
        changeCat(catClose);
      } else {
        changeCat(catOpen);
      }
    }
  };
  // Khi click ra ngoài form -> catOpen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        changeCat(catOpen);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const googleProvider = new GoogleAuthProvider();
  
    const handleGoogleLogin = async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        alert("Đăng nhập Google thành công 🚀");
        navigate("/home");
      } catch (error) {
        alert("Google login fail: " + error.message);
      }
    };
  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__cat-image">
          <img
            src={cat}
            alt="cat avatar"
            className={`register__cat-img ${animation}`}
          />
        </div>
        <div className="register__title">Đăng ký</div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="register__group">
          <label className="register__label" htmlFor="name">
            Tên
          </label>
          <input
            id="name"
            type="text"
            className="register__input"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="register__group">
          <label className="register__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="register__input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="register__group">
          <label className="register__label" htmlFor="password">
            Mật khẩu
          </label>
          <input
            ref={passwordRef}
            className="register__input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <div className="register__input--check">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={toggleShowPassword}
            />{" "}
            Hiện mật khẩu
          </div>
        </div>

        <div className="register__actions">
          <button type="submit" className="register__btn">
            {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
          </button>
          <a href="#" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              onClick={handleGoogleLogin}
              alt="Google logo"
            />
            Đăng ký với Google{" "}
          </a>
          <p className="register__text">
            Có tài khoản ròi hở?{" "}
            <Link to="/login" className="login__link">
              Đăng nhập liền !!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
