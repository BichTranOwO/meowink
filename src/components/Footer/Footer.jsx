import React from "react";
import "./footer.css";
import logo from "../../assets/images/logo_meowink.png";
import { Link } from "react-router-dom";
import { FaHeart,FaFacebookF, FaEnvelope, FaDiscord, FaPhone } from "react-icons/fa"; // lum icon

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        {/* Logo + mô tả */}
        <div className="footer__brand">
          <img src={logo} alt="Meowink Logo" className="footer__logo" />
          <p className="footer__desc">
            Meowink OwO – Nơi bạn học tập, làm việc và nghỉ ngơi thật đáng yêu
            mỗi ngày ✨
          </p>

          {/* Liên hệ  */}
          <h4 className="footer__contact-title">Liên Hệ Với Chúng Tôi</h4>
          <ContactLinks />
        </div>
        {/* Liên kết nhanh */}
        <div className="footer__links">
          <h4 className="footer__links-title">Liên kết nhanh</h4>
          <ul className="footer__links-list">
            <li className="footer__links-item">
              <Link to="/home">Trang chủ</Link>
            </li>
            <li className="footer__links-item">
              <Link to="/todo">Nhiệm vụ</Link>
            </li>
            <li className="footer__links-item">
              <Link to="/pomodoro">Pomodoro</Link>
            </li>
            <li className="footer__links-item">
              <Link to="/dashboard">Thống kê</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer__bottom">
        <small className="footer__copy">
          © {new Date().getFullYear()} Meowink OwO. Made with{" "}
          <FaHeart color="#ff6b81" /> by UwU💕
        </small>
      </div>
    </footer>
  );
}
function ContactLinks() {
return (
    <div className="footer__contact">

      <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="contact__icon contact__icon--fb"
        title="Facebook"
      >
        <FaFacebookF />
      </a>
      <a
        href="https://mail.google.com/"
        className="contact__icon contact__icon--mail"
        title="Email"
      >
        <FaEnvelope />
      </a>
      <a
        href="https://discord.gg"
        target="_blank"
        rel="noopener noreferrer"
        className="contact__icon contact__icon--discord"
        title="Discord"
      >
        <FaDiscord />
      </a>
      <a
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
        className="contact__icon contact__icon--zalo"
        title="Zalo"
      >
        <FaPhone />
      </a>
    </div>
  );
}   
