import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [birthday, setBirthday] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: email,
      applicantId: applicantId,
      birthdate: birthday,
    };
  
    try {
      // Verify login credentials
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        const birthdate = new Date(result.data.birthdate);
        const formattedBirthdate = birthdate.toLocaleDateString('en-US', {
          month: 'long',   // Full month name
          day: 'numeric',  // Day of the month
          year: 'numeric', // Full year
        });

        // Store the user data with the formatted birthdate
        const userData = { ...result.data, birthdate: formattedBirthdate };
        localStorage.setItem("userData", JSON.stringify(userData));
  
        onClose();
        Swal.fire({
          title: "Log In Successful",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/finalreq");
        });
      } else {
        // Handle login failure
        Swal.fire({
          title: "Login Failed",
          text: result.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to connect to the server.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Sign In</h2>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantId">Applicant ID</label>
            <input
              type="text"
              id="applicantId"
              placeholder="Enter your Applicant ID"
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthday">Birthday</label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
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
