import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import catOpen from "../../assets/images/meo-tach-ne.png";
import catClose from "../../assets/images/meo-che-mat-tach-nen.png";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../../firebase/config"; // đường dẫn tới file config
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState("login__cat-img--fade-in");
  const [cat, setCat] = useState(catOpen);
  const passwordRef = useRef(null);
  const formRef = useRef(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const changeCat = (newCat) => {
    if (newCat === cat) return;
    setAnimation("login__cat-img--fade-out");
    setTimeout(() => {
      setCat(newCat);
      setAnimation("login__cat-img--fade-in");
    }, 150);
  };

  const handleFocus = () => {
    if (password.length > 0 && !showPassword) {
      changeCat(catClose);
    }
  };

  const handleLoginHome = (e) => {
    e.preventDefault();

    // giả sử check role
    const role = "admin"; // hoặc "student"

    // chuyển hướng và gửi role kèm theo
    navigate("/home", { state: { role } });
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
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Đăng nhập thành công 🎉");
      // navigate("/dashboard"); // nếu cậu có router
    } catch (error) {
      let message = "Đăng nhập thất bại, thử lại nha 🐾";

      if (error.code === "auth/invalid-credential") {
        message = "Sai email hoặc mật khẩu rồi đó 😿 Thử lại đi nè!";
      } else if (error.code === "auth/user-not-found") {
        message = "Chưa có tài khoản này đâu, đăng ký liền cho nóng 🐱";
      } else if (error.code === "auth/wrong-password") {
        message = "Hình như mật khẩu chưa đúng á 🙈";
      }
      alert(message);
    }
  };

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
  useEffect(() => {
    const handleClickOutside = (e) => {
      // nếu click bên ngoài form login
      if (formRef.current && !formRef.current.contains(e.target)) {
        changeCat(catOpen);
      } 
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="login">
      <form ref={formRef} className="login__form" onSubmit={handleLogin}>
        {" "}
        <div className="login__cat-image">
          <img
            src={cat}
            alt="cat avatar"
            className={`login__cat-img ${animation}`}
          />
        </div>
        <div className="login__title">Đăng nhập</div>
        <div className="login__group">
          <label className="login__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="login__input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login__group">
          <label className="login__label" htmlFor="password">
            Mật khẩu
          </label>
          <input
            ref={passwordRef}
            className="login__input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            onFocus={handleFocus}
            onBlur={() => changeCat(catOpen)}
          />
          <div className="login__duoi-input-mk">
            <div className="login__input-check">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={toggleShowPassword}
              />{" "}
              Hiện mật khẩu
            </div>
            <div className="login__forget--pw"  onClick={() => navigate("/forgot-password")}>
              <Link to="/forgot-password">
                <p>Quên mật khẩu?</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="login__actions">
          <button
            type="submit"
            onSubmit={handleLoginHome}
            className="login__btn"
          >
            ĐĂNG NHẬP
          </button>
          <a className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
            />
            Đăng nhập với Google
          </a>

          <p className="register__text">
            Chưa có tài khoản đúng hông?{" "}
            <Link to="/register" className="register__link">
              Đăng ký ngay!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );    
}
