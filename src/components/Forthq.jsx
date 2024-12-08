import React, { useState } from "react";
import Fifthq from "./RegisterPopup";
import "./Questions.css";

const Fourthq = ({ onPrevious, onClose }) => {
  const [answers, setAnswers] = useState({
    goodMoral: "",
    noScholarship: "",
  });

  const [showNextPopup, setShowNextPopup] = useState(false);

  // Handle the selection of a radio button
  const handleSelection = (name, value) => {
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the Next button click
  const handleNext = () => {
    if (answers.goodMoral === "yes" && answers.noScholarship === "yes") {
      setShowNextPopup(true); // Proceed to the next popup if both are "Yes"
    } else {
      alert("You must meet all eligibility criteria to proceed.");
    }
  };

  return (
    <>
      {showNextPopup ? (
        <Fifthq onPrevious={() => setShowNextPopup(false)} onClose={onClose} />
      ) : (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Check Your Eligibility</h2>

            <div className="question">
              <p>
                Do you have good moral character and have no derogatory record
                from school/university?
              </p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="goodMoral"
                    value="yes"
                    checked={answers.goodMoral === "yes"}
                    onChange={(e) => handleSelection("goodMoral", e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="goodMoral"
                    value="no"
                    checked={answers.goodMoral === "no"}
                    onChange={(e) => handleSelection("goodMoral", e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="question">
              <p>Do you not have any existing scholarship or study grant?</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="noScholarship"
                    value="yes"
                    checked={answers.noScholarship === "yes"}
                    onChange={(e) => handleSelection("noScholarship", e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="noScholarship"
                    value="no"
                    checked={answers.noScholarship === "no"}
                    onChange={(e) => handleSelection("noScholarship", e.target.value)}
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

export default Fourthq;
