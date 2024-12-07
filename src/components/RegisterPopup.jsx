import React, { useState } from "react";
import "./RegisterPopup.css";

const RegisterPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    middleName: "",
    suffix: "",
    birthday: "",
    email: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const { surname, firstName, middleName } = formData;
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(surname) || !namePattern.test(firstName) || !namePattern.test(middleName)) {
      setError("Name fields should contain only alphabets and spaces.");
      return;
    }
    console.log("Form Data being sent:", formData);
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Registration successful. Application ID: ${data.application_id}`);
        onClose();  // Close the popup after successful registration
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Register</h2>
        <p className="deadline">Deadline of Application: February 15, 2025</p>

        {error && <p className="error-message">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                id="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Middle Name and Suffix */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="middlename">Middle Name</label>
              <input
                type="text"
                id="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="suffix">Suffix Name (Jr, III, II, etc.)</label>
              <input
                type="text"
                id="suffix"
                placeholder="Suffix Name"
                value={formData.suffix}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="form-group">
            <label htmlFor="birthday">Birthdate</label>
            <input
              type="date"
              id="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
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
