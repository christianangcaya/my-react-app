import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import "./LoginPopup.css";

const LoginPopup = ({ onClose }) => {
  const navigate = useNavigate(); 

  const handleLoginClick = (e) => {
    onClose();
    e.preventDefault();
    Swal.fire({
      title: "Log In Successful",
      text: "Welcome back! You will be redirected to Final Requiremnets Page.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/finalreq");
    });
  };
  
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Sign In</h2>
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
            <button type="button" className="close-button" onClick={handleLoginClick}>
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
