import React, { useState, useRef } from "react";
import "./Registration.css";
import DefaultImage from "./assets/pfp_placeholder.png";

const Registration = () => {
  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef();
  const [grantType, setGrantType] = useState("");

  const handleImageUpload = () => {
    fileUploadRef.current.click(); // Trigger the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarURL(reader.result); // Set the uploaded image as avatar
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  };

  const handleGrantAppliedForChange = (event) => {
    setGrantType(event.target.value);
  };

  return (
    <>
      <div className="application-header">
        <h2>DAET EXPANDEDE SCHOLARSHIP PROGRAM</h2>
        <p>(Per Municipal Ordinance No. 372 S. 2018)</p>
        <br />
        <h2>Application Form</h2>
        <hr style={{ border: "1px solid #000", marginTop: "10px" }} />
      </div>
    </>
  );
};

export default Registration;
