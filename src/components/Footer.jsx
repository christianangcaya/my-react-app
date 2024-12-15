import React from "react";
import "./Footer.css";
import footerimage from "../assets/lgu-logo.png";
import fbimage from "../assets/fb.png";
import emailimage from "../assets/email.png";
import phoneimage from "../assets/telephonee.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="section1">
        <p>Contact Us:</p>
        <ul>
          <a href="https://www.facebook.com/profile.php?id=100067135762198">
            {" "}
            <span>
              <img src={fbimage}></img>
            </span>
            Lgu-Daet Expanded Scholarship Program
          </a>
          <a>
            {" "}
            <span>
              <img src={emailimage}></img>
            </span>
            Email: lgudaetsprogram@gmail.com
          </a>
          <a>
            {" "}
            <span>
              <img src={phoneimage}></img>
            </span>
            Phone: 524-565-8653
          </a>
        </ul>
      </div>s
      <div className="section2">
        <img src={footerimage} alt="Footer Logo" />
      </div>
      <div className="section3">
        <p>All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
