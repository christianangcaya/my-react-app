import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Logo" className="logo-img" />
        <div>
          <h1>E-Scholarship Application System</h1>
          <p>LOCAL GOVERNMENT UNIT - DAET</p>
        </div>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#faqs">FAQs</a></li>
          <li><a href="#user"><img src="user-icon.png" alt="User Icon" className="user-icon" /></a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
