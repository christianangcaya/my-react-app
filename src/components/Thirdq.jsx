import React, { useState } from "react";
import Fourthq from "./Forthq";
import "./Questions.css";
import Swal from "sweetalert2";

const Thirdq = ({ onPrevious, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showNextPopup, setShowNextPopup] = useState(false);


  const handleSelection = (value) => {
    setSelectedOption(value);
  };


  const handleNext = () => {
    if (selectedOption === "yes") {
      setShowNextPopup(true); 
    } else {
      // alert("You must meet the eligibility criteria to proceed.");
      onClose();
      Swal.fire({
        title: "Youre not Eligible",
        text: "You are not eligible to proceed",
        icon: "error",
        confirmButtonText: "OK",
      })
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

            <div className="form-buttons">
              <button className="close-button" onClick={onPrevious}>
                Previous
              </button>
              <button className="close-button" onClick={handleNext}>
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
