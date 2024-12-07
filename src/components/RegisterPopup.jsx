import React from "react";
import "./RegisterPopup.css";

const RegisterPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Register</h2>
        <p className="deadline">Deadline of Application: February 15, 2025</p>
        <form className="register-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input type="text" id="surname" placeholder="Surname" />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input type="text" id="firstname" placeholder="First Name" />
            </div>
          </div>

          {/* Middle Name and Suffix */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="middlename">Middle Name</label>
              <input type="text" id="middlename" placeholder="Middle Name" />
            </div>
            <div className="form-group">
              <label htmlFor="suffix">Suffix Name (Jr, III, II, etc.)</label>
              <input type="text" id="suffix" placeholder="Suffix Name" />
            </div>
          </div>

          {/* Birthday */}
          <div className="form-group">
            <label htmlFor="birthday">Birthdate</label>
            <input type="date" id="birthday" />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Email Address" />
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="close-button" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPopup;
