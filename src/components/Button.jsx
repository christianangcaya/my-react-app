import React, { useState } from "react";
import LoginPopup from "./LoginPopup"; 
import Firstq from "./firstq";
import "./Buttons.css";

const Buttons = () => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);


  const handleLoginClick = () => {
    setLoginVisible(true);
  };


  const handleCloseLogin = () => {
    setLoginVisible(false);
  };

  const handleRegisterClick = () => {
    setRegisterVisible(true);
  };


  const handleCloseRegister = () => {
    setRegisterVisible(false);
  };

  return (
    <div className="buttons">

      <button className="button register" onClick={handleRegisterClick}>Check your ELIGIBILITY</button>

      <button className="button login" onClick={handleLoginClick}>
        Already a Scholar? LOG - IN
      </button>

      {isLoginVisible && <LoginPopup onClose={handleCloseLogin} />}

      {isRegisterVisible && <Firstq onClose={handleCloseRegister}/>}


    </div>
  );
};

export default Buttons;
