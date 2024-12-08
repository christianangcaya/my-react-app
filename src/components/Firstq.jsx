import React, { useState } from "react";
import Secondq from "./Secondq";
import "./Questions.css";

const Firstq = ({ onClose }) => {
  const [eligibility, setEligibility] = useState({
    isResident: "",
    isVoter: "",
  });

  const [showNextPopup, setShowNextPopup] = useState(false);

  // Handle changes for radio buttons
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEligibility((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle "Next" button click
  const handleNext = () => {
    if (eligibility.isResident === "yes" && eligibility.isVoter === "yes") {
      setShowNextPopup(true); // Show the Second Popup
    } else {
      alert("You are not eligible to proceed.");
    }
  };

  return (
    <>
      {showNextPopup ? (
        <Secondq onPrevious={() => setShowNextPopup(false)} onClose={onClose} />
      ) : (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Check Your Eligibility</h2>

            {/* First Question */}
            <div className="question">
              <p>Are you a resident of the Municipality of Daet?</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="isResident"
                    value="yes"
                    checked={eligibility.isResident === "yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="isResident"
                    value="no"
                    checked={eligibility.isResident === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Second Question */}
            <div className="question">
              <p>
                Is your parent/guardian a registered voter in the Municipality
                of Daet?
              </p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="isVoter"
                    value="yes"
                    checked={eligibility.isVoter === "yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="isVoter"
                    value="no"
                    checked={eligibility.isVoter === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button type="button" className="close-button" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="close-button"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Firstq;
