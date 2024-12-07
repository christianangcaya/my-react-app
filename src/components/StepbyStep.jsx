import React from "react";
import "./StepbyStep.css"

const StepbyStep = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Steps to Apply</h2>
        <div className="popup-content">
          <p><strong>STEP 1</strong></p>
          <p>If you're <strong>ELIGIBLE</strong> to apply for the scholarship, register only using a valid email address.</p>
          <p><strong>STEP 2</strong></p>
          <p>A confirmation will be sent to your email address upon successful registration.</p>
          <p><strong>STEP 3</strong></p>
          <p>
            You can now proceed with filling out the application form. These are the needed requirements:
          </p>
          <ul>
            <li>Personal Data</li>
            <li>Contact Information</li>
            <li>School Related Information</li>
            <li>Family Background</li>
            <li>Financial Contribution</li>
            <li>1x1 Picture</li>
            <li>
              Annual Income Tax Return of both parents
              <ul>
                <li>* The system accepts .jpeg, .png file type only.</li>
                <li>* The system accepts multiple files per upload.</li>
                <li>* You may press the preview button to check files you submitted after uploading it.</li>
              </ul>
            </li>
          </ul>
          <p><strong>STEP 4</strong></p>
          <p>
            Make sure that you have accomplished all the needed requirements with true information and correct spellings,
            and uploaded all the required documents before you press <strong>SUBMIT</strong> button.
          </p>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StepbyStep;
