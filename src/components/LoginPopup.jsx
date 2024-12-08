import React from "react";
import "./LoginPopup.css";
//import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const LoginPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Sign In In</h2>
        <form className="login-form">

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label htmlFor="applicantId">Applicant ID</label>
            <input type="text" id="applicantId" placeholder="Enter your Applicant ID" />
          </div>

          <div className="form-group">
            <label htmlFor="birthday">Birthday</label>
            <input type="date" id="birthday" />
          </div>

          <div className="form-buttons">
            <button type="button" className="close-button" onClick={onClose}>
              Close
            </button>
            <Link type="submit" className="submit-button" to="/finalreq">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
