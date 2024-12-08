import React, { useState } from "react";
import Fourthq from "./Forthq";
import "./Questions.css";

const Thirdq = ({ onPrevious, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showNextPopup, setShowNextPopup] = useState(false);

  // Handle the selection of a radio button
  const handleSelection = (value) => {
    setSelectedOption(value);
  };

  // Handle the Next button click
  const handleNext = () => {
    if (selectedOption === "yes") {
      setShowNextPopup(true); // Proceed to the next popup
    } else {
      alert("You must meet the eligibility criteria to proceed.");
    }
  };

  return (
    <>
      {showNextPopup ? (
        <Fourthq onPrevious={() => setShowNextPopup(false)} onClose={onClose} />
      ) : (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Check Your Eligibility</h2>
            <div className="question">
              <p>
                Parent(s)/Guardian(s) combined gross income does not exceed the
                latest poverty threshold?
              </p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="incomeEligibility"
                    value="yes"
                    onChange={(e) => handleSelection(e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="incomeEligibility"
                    value="no"
                    onChange={(e) => handleSelection(e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button className="close-button" onClick={onPrevious}>
                Previous
              </button>
              <button className="next-button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Thirdq;
