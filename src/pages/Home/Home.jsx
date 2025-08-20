import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import catGif from "../../assets/images/Cat-Working-Sticker.gif";
import catTodo from "../../assets/images/meo_todo.png";
import catPomodoro from "../../assets/images/meo_pomodoro.png";
import catDashboard from "../../assets/images/meo_dashboard.png";
import catLike from "../../assets/images/icon-meo-like.png";
import catHeart from "../../assets/images/meo-tha-tym.png";
import catCheckMark from "../../assets/images/meo-tich-xanh.png";
import studyWithCat from "../../assets/images/study-with-meo.jpg"; // Ảnh minh họa cho phần trích dẫn
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase/config"; // file config Firebase
import { useNavigate } from "react-router-dom";
const quotes = [
  "Học, học nữa, học mãi. – V.I. Lenin",
  "Thành công không phải là đích đến, đó là một hành trình. – Zig Ziglar",
  "Không có thang máy nào dẫn đến thành công, bạn phải đi cầu thang bộ.",
  "Kiến thức là sức mạnh. – Francis Bacon",
  "Chỉ cần bạn không dừng lại, việc bạn tiến chậm không thành vấn đề. – Khổng Tử",
  "Người thành công là người học hỏi suốt đời.",
  "Hãy làm việc chăm chỉ trong im lặng, để thành công lên tiếng.",
  "Đừng sợ thất bại, hãy sợ không cố gắng.",
  "Học từ quá khứ, sống trong hiện tại, hy vọng cho tương lai. – Albert Einstein",
  "Mỗi ngày là một cơ hội mới để học hỏi và phát triển.",
  "Ghi chép không chỉ là lưu lại thông tin, đó là cách bạn tự đặt câu hỏi, phân tích và vận dụng kiến thức để bước xa hơn trên hành trình học tập.",
  "Trí tuệ không phải sản phẩm của trường lớp, mà là kết quả của nỗ lực học hỏi suốt đời."
];

function RandomQuote() {
  const [quote, setQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  useEffect(() => {
    const id = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return <blockquote className="home__quote">{quote}</blockquote>;
}

function DropdownButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      className="home__dropdown-button"
      ref={ref}
      onClick={() => setOpen(!open)}
    >
      Bắt đầu ngay!
      <div className={`dropdown-menu ${open ? "open" : ""}`}>
        <Link to="/todo" className="home__dropdown-item">
          <i className="fa-solid fa-list"></i> Tạo Nhiệm Vụ
        </Link>
        <Link to="/pomodoro" className="home__dropdown-item">
          <i className="fa-solid fa-clock"></i> Tạo Pomodoro
        </Link>
      </div>
    </div>
  );
}

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ đặt ở đây
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home">
      {user ? (
        // ✅ ĐÃ ĐĂNG NHẬP
        <div className="home__banner">
          <div className="home__text">
            <h1 className="home__title">Chào mừng bạn đến với Meowink OwO</h1>
            <h2 className="home__hello">
              Xin chào {user.displayName || user.email} 🐾 đã ghé nha :3
            </h2>
            <h3 className="home__subtitle">
              Hôm nay bạn hãy tập trung học và làm thật tốt nhá!!
            </h3>
            <div className="home__content">
              <DropdownButton />
            </div>
          </div>
          <div className="home__image">
            <img src={catGif} alt="Banner" className="home__banner-image" />
          </div>
        </div>
      ) : (
        // ❌ CHƯA ĐĂNG NHẬP
        <div className="home__banner">
          <div className="home__text">
            <h1 className="home__title">Chào mừng bạn đến với Meowink OwO</h1>
            <h3 className="home__subtitle">
              Hôm nay bạn hãy học thật tốt nhá!!
            </h3>
            <div className="home__content">
              <DropdownButton />
            </div>
          </div>
          <div className="home__image">
            <img src={catGif} alt="Banner" className="home__banner-image" />
          </div>
        </div>
      )}
      {user ? (
        <>
          {/* ĐÃ ĐĂNG NHẬP */}
          <div className="home__card-container">
            <div
              className="home__card"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/todo")}
              onKeyDown={(e) => e.key === "Enter" && navigate("/todo")}
            >
              <img src={catTodo} alt="Todo" className="home__card-icon" />
              <h4 className="home__card-title">Nhiệm vụ của bạn</h4>
              <p className="home__card-desc">
                Xem và quản lý các nhiệm vụ đã tạo.
              </p>
              <button className="home__btn--card">
                <Link to="/todo" className="home__card-link">
                  <span>Đi tới Todo </span>
                </Link>
              </button>
            </div>

            <div
              className="home__card"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/pomodoro")}
              onKeyDown={(e) => e.key === "Enter" && navigate("/pomodoro")}
            >
              <img
                src={catPomodoro}
                alt="Pomodoro"
                className="home__card-icon"
              />
              <h4 className="home__card-title">Phiên Pomodoro</h4>
              <p className="home__card-desc">
                Bắt đầu ngay một phiên Pomodoro.
              </p>
              <button className="home__btn--card">
                <Link to="/pomodoro" className="home__card-link">
                  <span> Bắt đầu </span>
                </Link>
              </button>
            </div>

            <div
              className="home__card"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/dashboard")}
              onKeyDown={(e) => e.key === "Enter" && navigate("/dashboard")}
            >
              <img
                src={catDashboard}
                alt="Dashboard"
                className="home__card-icon"
              />
              <h4 className="home__card-title">Thống kê</h4>
              <p className="home__card-desc">Theo dõi tiến độ của bạn.</p>
              <button className="home__btn--card">
                <Link to="/dashboard" className="home__card-link">
                  <span>Xem thống kê </span>
                </Link>
              </button>
            </div>
          </div>

          <div className="home__big--intro">
            <div className="home__feature--container">
              <div className="home__feature">
                <img
                  src={catLike}
                  alt="Tiến độ"
                  className="home__feature--icon"
                />
                <span className="home__feature--text">
                  Bạn đã hoàn thành 3 nhiệm vụ hôm nay 🎉
                </span>
              </div>
              <div className="home__feature">
                <img
                  src={catHeart}
                  alt="Nhắc nhở"
                  className="home__feature--icon"
                />
                <span className="home__feature--text">
                  Đừng quên nghỉ ngơi sau khi Pomodoro nhé 💤
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* CHƯA ĐĂNG NHẬP */}
          <div className="home__card-container">
            <div className="home__card">
              <img src={catTodo} alt="Nhiệm vụ" className="home__card-icon" />
              <h4 className="home__card-title">Nhiệm vụ (Todo List)</h4>
              <p className="home__card-desc">
                Tạo, quản lý và hoàn thành các nhiệm vụ hàng ngày của bạn một
                cách hiệu quả.
              </p>
            </div>
            <div className="home__card">
              <img
                src={catPomodoro}
                alt="Pomodoro"
                className="home__card-icon"
              />
              <h4 className="home__card-title">Phiên Pomodoro</h4>
              <p className="home__card-desc">
                Tập trung làm việc với kỹ thuật Pomodoro, xen kẽ giữa thời gian
                làm việc và nghỉ ngơi.
              </p>
            </div>
            <div className="home__card">
              <img
                src={catDashboard}
                alt="Thống kê"
                className="home__card-icon"
              />
              <h4 className="home__card-title">Xem thống kê</h4>
              <p className="home__card-desc">
                Theo dõi tiến độ và hiệu suất làm việc của bạn qua các báo cáo
                trực quan.
              </p>
            </div>
          </div>

          <div className="home__big--intro">
            <div className="home__feature--container">
              <div className="home__feature">
                <img
                  src={catLike}
                  alt="Giao diện dễ thương"
                  className="home__feature--icon"
                />
                <span className="home__feature--text">
                  Giao diện dễ thương, siu đáng iu
                </span>
              </div>
              <div className="home__feature">
                <img
                  src={catHeart}
                  alt="Dễ sử dụng"
                  className="home__feature--icon"
                />
                <span className="home__feature--text">
                  Dễ sử dụng, phù hợp cho mọi đối tượng
                </span>
              </div>
              <div className="home__feature">
                <img
                  src={catCheckMark}
                  alt="Tối ưu"
                  className="home__feature--icon"
                />
                <span className="home__feature--text">
                  Tối ưu hiệu suất học tập và làm việc
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="home__quote-section">
        <img
          src={studyWithCat}
          alt="Học cùng mèo"
          className="home__quote-image"
        />
        <div className="home__right">
        <div className="home__quote--text">
          <em>
            <RandomQuote />
          </em>
        </div>

        {!user && ( //chỉ hiện khi CHƯA ĐĂNG NHẬP
        
          <div className="home__login">
            <h3>Bắt đầu hành trình của bạn nào!!</h3>
            <p>
              Hãy đăng nhập hoặc đăng ký để trải nghiệm các tính năng tuyệt vời
              của Meowink!
            </p>
            <div className="home__login--btn">
              <Link to="/login" className="button--login">
                <i className="fa fa-sign-in-alt"></i> <span>Đăng nhập</span>
              </Link>
              <Link to="/register" className="button--register">
                <i className="fa fa-user-plus"></i> <span>Đăng ký</span>
              </Link>
            </div>
          </div>
        
        )}
        </div>
      </div>
    </div>
  );
};
export default Home;
