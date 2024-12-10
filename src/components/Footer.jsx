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
          <li>
            {" "}
            <span>
              <img src={fbimage}></img>
            </span>
            Lgu-Daet Expanded Scholarship Program
          </li>
          <li>
            {" "}
            <span>
              <img src={emailimage}></img>
            </span>
            Email: lgudaetsprogram@gmail.com
          </li>
          <li>
            {" "}
            <span>
              <img src={phoneimage}></img>
            </span>
            Phone: 524-565-8653
          </li>
        </ul>
      </div>
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
