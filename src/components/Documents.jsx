import React, { useState } from "react";
import "./Documents.css";
import StepbyStep from "./StepbyStep";
import Requirements from "./Requirements";

const Documents = () => {
  const [isSbySVisible, setSbySVisible] = useState(false);
  const [isDocuVisible, setDocuVisible] = useState(false);

  const handleSbySClick = () => {
    setSbySVisible(true);
  };

  const handleCloseSbyS = () => {
    setSbySVisible(false);
  };

  const handleDocuClick = () => {
    setDocuVisible(true);
  };

  const handleCloseDocu = () => {
    setDocuVisible(false);
  };

  return (
    <section className="documents">
      <div className="documents-header">
        <h2>Documents to Prepare Prior to Filing Scholarship Application</h2>
        <a className="link" onClick={handleDocuClick}>
          Click here
        </a>
      </div>

      <div className="documents-header">
        <h2>Steps in Filling Out E-Scholarship Application</h2>
        <a className="link" onClick={handleSbySClick}>
          Click here
        </a>
      </div>

      <StepbyStep isOpen={isSbySVisible} onClose={handleCloseSbyS} />
      <Requirements isOpen={isDocuVisible} onClose={handleCloseDocu} />
    </section>
  );
};

export default Documents;
