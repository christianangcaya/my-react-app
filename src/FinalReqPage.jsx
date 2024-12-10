import React, { useState } from "react";
import "./FinalReqPage.css";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinalReqPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Logged Out",
          "You have been successfully logged out.",
          "success"
        ).then(() => {
          navigate("/"); 
        });
      }
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const [currentFileType, setCurrentFileType] = useState("");

  const handleUploadClick = (fileType) => {
    setCurrentFileType(fileType); 
    setShowPopup(true); 
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [currentFileType]: file, // Store file by type
      }));
      Swal.fire("File Selected", `File for ${currentFileType} has been added temporarily.`, "success");
      closePopup();
    }
  };

  const handleSubmitAll = () => {
    if (Object.keys(files).length === 0) {
      Swal.fire("Error", "No files uploaded to submit.", "error");
      return;
    }

    const formData = new FormData();
    for (const [fileType, file] of Object.entries(files)) {
      formData.append(fileType, file); // Add each file with its type as the key
    }

    // Send files to Flask
    axios
      .post("http://localhost:5000/submit-all", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        Swal.fire("Success", "All files uploaded successfully.", "success");
      })
      .catch((error) => {
        Swal.fire("Error", "Failed to upload files.", "error");
      });
  };

  return (
    <div className="application-page">
      <header className="lg-btn">
        <button className="logout-button" onClick={handleLogout}>LOG OUT</button>
      </header>
      <div className="application-details">
        <h3>APPLICATION ID: 0N2WDWV037FBD</h3>
        <p>
          Status: <strong>FOR VALIDATION</strong>
        </p>
        <p>Name of Applicant: Juan Dela Cruz</p>
        <p>Birthdate: 06/23/2000</p>
      </div>

      <div className="requirements">
        <h3>Requirements</h3>
        <table className="requirements-table">
          <thead>

            <tr>
              <th>Requirement</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td>CERTIFIED TRUE COPY of BIRTH CERTIFICATE<p>STATUS: No file uploaded</p></td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "CERTIFIED TRUE COPY of BIRTH CERTIFICATE"
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                ORIGINAL CERTIFICATION from Punong Barangay that the applicant
                is a bona fide indigent resident of their barangay
                <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "ORIGINAL CERTIFICATION from Punong Barangay"
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                ORIGINAL COMELEC Voter’s Certification of the applicant, if
                minor, voter’s certification of parents/guardian<p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick("ORIGINAL COMELEC Voter’s Certification")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                CERTIFIED TRUE COPY of Report Card of Form 138; <br></br>CERTIFICATE of
                Grades for college level<p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick("CERTIFIED TRUE COPY of Report Card")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
              CERTIFIED TRUE COPY of Good Moral Character signed by the principal for senior high school graduate,<br></br>
              CERTIFIED TRUE COPY of Good Moral Character signed by the guidance counselor for college level,<br></br>
              ORIGINAL certificate of Good Moral Character signed by the Punong Barangay for out of school youth,
              <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick("CERTIFIED TRUE COPY of Good Moral Character ")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
              ORIGINAL certificate from PDAO for PWD or;<br></br>
              ORIGINAL certificate from Municipal Agriculture Office for farmers or fisher folks children;<br></br>
              ORIGINAL certificate from MSWDO for solo parent’s children; or solo parent applicant. 
              <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button 
                  onClick={() =>
                    handleUploadClick("ORIGINAL certificate of PDAO/Municipal Agriculture Office/MSWDO ")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
              Original or Certified true copy of enrollment/ registration form;
              <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button 
                  onClick={() =>
                    handleUploadClick("Original or Certified true copy of enrollment/ registration form")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
              Original or CERTIFIED TRUE COPY of certification from MSWDO that the qualified scholar belongs to the indigent family of the municipality;
              <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button 
                  onClick={() =>
                    handleUploadClick("Original or CERTIFIED TRUE COPY of certification from MSWDO")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
              CERTIFICATION by the parents or guardians that the applicant is not enjoying any government or private scholarship grants. 
              <p>STATUS: No file uploaded</p>
              </td>
              <td>
                <button 
                  onClick={() =>
                    handleUploadClick("CERTIFICATION by the parents or guardians")
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <button className="submit-button" onClick={handleSubmitAll}>SUBMIT ALL</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Upload File for: {currentFileType}</h3>
            <input type="file" onChange={handleFileChange}/>
            <div className="popup-buttons">
              <button onClick={closePopup} className="close-button">
                Cancel
              </button>
              <button className="upload-button">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalReqPage;
