import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import lguImage from "../assets/lgu-logo.png"

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={lguImage} alt="Logo" className="logo-img" />
        <div>
          <h1>E-Scholarship Application System</h1>
          <p>LOCAL GOVERNMENT UNIT - DAET</p>
        </div>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/faqs">FAQs</Link>
          </li>
          <li>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
