import React, { useState } from "react";
import Thirdq from "./Thirdq";
import "./Questions.css";
import Swal from "sweetalert2";

const Secondq = ({ onPrevious, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showNextPopup, setShowNextPopup] = useState(false);


  const handleSelection = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === "yes") {
      setShowNextPopup(true); 
    } else {
      //alert("You must meet the eligibility criteria to proceed.");
      onClose();
      Swal.fire({
        title: "Youre not Eligible",
        text: "You must meet all eligibility criteria to proceed",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  };

  return (
    <>
      {showNextPopup ? (
        <Thirdq onPrevious={() => setShowNextPopup(false)} onClose={onClose} />
      ) : (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Check Your Eligibility</h2>
            <div className="question">
              <p>
                A. For Senior High School, do you have at least 80% average with
                no failing in any subject?
              </p>
              <p>
                B. For College Level or College Undergraduate, do you have a
                weighted grade of at least 2.5 in the last semester in college
                and have not yet completed a tertiary course?
              </p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="eligibility"
                    value="yes"
                    onChange={(e) => handleSelection(e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="eligibility"
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

export default Secondq;
