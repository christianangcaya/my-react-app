import React, { useEffect, useState } from "react";
import "./FinalReqPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinalReqPage = () => {
  const [colors, setColors] = useState({ 
    p1: 'red',
    p2: 'red',
    p3: 'red',
    p4: 'red',
    p5: 'red',
    p6: 'red',
    p7: 'red',
    p8: 'red',
    p9: 'red' });

  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({
    1: "No file uploaded",
    2: "No file uploaded",
    3: "No file uploaded",
    4: "No file uploaded",
    5: "No file uploaded",
    6: "No file uploaded",
    7: "No file uploaded",
    8: "No file uploaded",
    9: "No file uploaded",
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    console.log("Loaded user data:", data);
    setUserData(data);
  }, []);

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

  const handleUploadClick = (fileType, id) => {
    setCurrentFileType(fileType);
    setShowPopup(id);
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
    }
  };

  const handleSubmitAll = () => {
    const requiredFiles = [
      "CERTIFIED TRUE COPY of BIRTH CERTIFICATE",
      "ORIGINAL CERTIFICATION from Punong Barangay",
      "ORIGINAL COMELEC Voter’s Certification",
      "CERTIFIED TRUE COPY of Report Card",
      "CERTIFIED TRUE COPY of Good Moral Character ",
      "ORIGINAL certificate of PDAO or Municipal Agriculture Office or MSWDO ",
      "Original or Certified true copy of enrollment or registration form",
      "Original or CERTIFIED TRUE COPY of certification from MSWDO",
      "CERTIFICATION by the parents or guardians",
    ];

    const missingFiles = requiredFiles.filter((fileType) => !files[fileType]);

    if (missingFiles.length > 0) {
      Swal.fire(
        "Error",
        `The following files are missing: ${missingFiles.join(", ")}. Please upload them before submitting.`,
        "error"
      );
      return;
    }

    const lastName = userData.surname;
    const applicant_id = userData.application_id;

    const formData = new FormData();

    formData.append("last_name", lastName);
    formData.append("applicant_id", applicant_id);

    for (const [fileType, file] of Object.entries(files)) {
      formData.append(fileType, file);
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

  // const handleColors = (id) => { setColors((prevColors) => ({ ...prevColors, [id]: prevColors[id] === 'red' ? 'green' : 'red' }));}
  const handleUpload = () => {
    if (files[currentFileType]) {
      setShowPopup(false); // Close popup
      Swal.fire({
        title: "File Uploaded",
        text: `File for ${currentFileType} successfully uploaded.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Update colors and statuses using the correct ID
        setColors((prevColors) => ({ ...prevColors, [`p${showPopup}`]: 'green' }));
        setStatus((prevStatuses) => ({
          ...prevStatuses,
          [showPopup]: "File uploaded successfully",
        }));
      });
    } else {
      setShowPopup(false);
      Swal.fire("Error", "Please select a file before uploading.", "error");
    }
  };
  

  return (
    <div className="application-page">
      <header className="lg-btn">
        <button className="logout-button" onClick={handleLogout}>
          LOG OUT
        </button>
      </header>
      <div className="application-details">
        {userData ? (
          <>
            <h3>APPLICATION ID: {userData.application_id}</h3>
            <p>Status: <strong>FOR VALIDATION</strong></p>
            <p>Name of Applicant: {userData.first_name} {userData.surname}</p>
            <p>Birthdate: {userData.birthdate}</p>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
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
              <td>
                CERTIFIED TRUE COPY of BIRTH CERTIFICATE
                <p id="1" style={{color: colors.p1}}>STATUS: {status[1]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "CERTIFIED TRUE COPY of BIRTH CERTIFICATE",
                      1
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
                <p id="2"  style={{color: colors.p2}}>STATUS:{status[2]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "ORIGINAL CERTIFICATION from Punong Barangay",
                      2
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
                minor, voter’s certification of parents/guardian
                <p id="3"  style={{color: colors.p3}}>STATUS:{status[3]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "ORIGINAL COMELEC Voter’s Certification",
                      3
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                CERTIFIED TRUE COPY of Report Card of Form 138; <br></br>
                CERTIFICATE of Grades for college level
                <p id="4"  style={{color: colors.p4}}>STATUS:{status[4]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick("CERTIFIED TRUE COPY of Report Card", 4)
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                CERTIFIED TRUE COPY of Good Moral Character signed by the
                principal for senior high school graduate,<br></br>
                CERTIFIED TRUE COPY of Good Moral Character signed by the
                guidance counselor for college level,<br></br>
                ORIGINAL certificate of Good Moral Character signed by the
                Punong Barangay for out of school youth,
                <p id="5"  style={{color: colors.p5}}>STATUS:{status[5]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "CERTIFIED TRUE COPY of Good Moral Character ",
                      5
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                ORIGINAL certificate from PDAO for PWD or;<br></br>
                ORIGINAL certificate from Municipal Agriculture Office for
                farmers or fisher folks children;<br></br>
                ORIGINAL certificate from MSWDO for solo parent’s children; or
                solo parent applicant.
                <p id="6"  style={{color: colors.p6}}>STATUS:{status[6]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "ORIGINAL certificate of PDAO or Municipal Agriculture Office or MSWDO ",
                      6
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                Original or Certified true copy of enrollment/ registration
                form;
                <p id="7"  style={{color: colors.p7}}>STATUS:{status[7]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "Original or Certified true copy of enrollment or registration form",
                      7
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                Original or CERTIFIED TRUE COPY of certification from MSWDO that
                the qualified scholar belongs to the indigent family of the
                municipality;
                <p id="8"  style={{color: colors.p8}}>STATUS:{status[8]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "Original or CERTIFIED TRUE COPY of certification from MSWDO",
                      8
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>

            <tr>
              <td>
                CERTIFICATION by the parents or guardians that the applicant is
                not enjoying any government or private scholarship grants.
                <p id="9"  style={{color: colors.p9}}>STATUS:{status[9]}</p>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUploadClick(
                      "CERTIFICATION by the parents or guardians",
                      9
                    )
                  }
                >
                  UPLOAD FILE
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="submit-button" onClick={handleSubmitAll}>
        SUBMIT ALL
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Upload File for: {currentFileType}</h3>
            <input type="file" onChange={handleFileChange} />
            <div className="popup-buttons">
              <button onClick={closePopup} className="close-button">
                Cancel
              </button>
              <button className="upload-button" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalReqPage;
