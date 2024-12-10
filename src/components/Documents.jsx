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
      <h3>Documents to Prepare Prior to Filing Scholarship Application</h3>
      <a className="link" onClick={handleDocuClick}>
        Click here
      </a>
      <h3>Steps in Filling Out E-Scholarship Application</h3>
      <a className="link" onClick={handleSbySClick}>
        Click here
      </a>
      <p>
        When you have all the necessary requirements needed,accomplish the form
        and upload the documents; you are now ready to access the LGU - Daet
        E-Scholarship Application System.{" "}
      </p>

      <StepbyStep isOpen={isSbySVisible} onClose={handleCloseSbyS} />
      <Requirements isOpen={isDocuVisible} onClose={handleCloseDocu} />
    </section>
  );
};

export default Documents;
