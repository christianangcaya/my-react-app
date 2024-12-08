import React from "react";
import "./Requirements.css";

const Requirements = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Scholarship Requirements</h2>
        <div className="popup-content">
          <h3>Initial Requirements</h3>
          <ul>
            <li>BIR Form 1701 (Annual Income Tax Return) of both parents that shows the gross income.</li>
          </ul>
          <h3>Final Requirements</h3>
          <ul>
            <li>Certified True Copy of Birth Certificate</li>
            <li>
              Original Certification from Punong Barangay that the applicant is a bonafide indigent resident of their
              barangay.
            </li>
            <li>
              Original COMELEC Voter’s Certification of the applicant; if minor, voters certification of parent or
              guardian.
            </li>
            <li>
              Certified True Copy of Report Card or Form 138 (except for ALS); Certificate of Grades (COG) for college
              level.
            </li>
            <li>
              <ul>
                <li>
                  Certified True Copy of Good Moral Character signed by the principal for senior high school graduate.
                </li>
                <li>
                  Certified True Copy of Good Moral Character signed by the guidance counselor for college level.
                </li>
                <li>
                  Original Certificate of Good Moral Character signed by the Punong Barangay for out-of-school youth.
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>Original Certificate from PDAO for PWD or;</li>
                <li>Original Certificate from Municipal Agriculture Office for farmers or fisher folks' children;</li>
                <li>Original Certificate from MSWDO for solo parent’s children or solo parent applicant.</li>
              </ul>
            </li>
            <li>Original or Certified True Copy of enrollment/registration form.</li>
            <li>
              Original or Certified True Copy of certification from MSWDO that the qualified scholar belongs to the
              indigent family of the municipality.
            </li>
            <li>
              Certification by the parents or guardians that the applicant is not enjoying any government or private
              scholarship grants.
            </li>
          </ul>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Requirements;
