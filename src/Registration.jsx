import React, { useState, useRef } from "react";
import "./Registration.css";
import DefaultImage from "./assets/pfp_placeholder.png";
import PreviewIcon from "./assets/itr_preview.png";

// Reusable input component
const InputField = ({ id, label, name, type = "text", value, onChange }) => (
  <div className="name-group">
    <input type={type} id={id} name={name} value={value} onChange={onChange} />
    <label htmlFor={id}>{label}</label>
  </div>
);

// Reusable radio option component
const RadioOption = ({ id, name, value, label, checked, onChange }) => (
  <div className="radio-option">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

const gradeYearOptions = {
  kindergarten: ["N/A"],
  elementary: [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ],
  junior_high: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  senior_high: ["Grade 11", "Grade 12"],
  college: [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
    "6th Year",
  ],
  als: ["N/A"],
};

const Registration = () => {
  const [formData, setFormData] = useState({
    avatarURL: DefaultImage,
    grant_type: "",
    sex: "",
    civilStatus: "",
    birthdate: "",
    applicant_id: "",
    name: { lastName: "", firstName: "", middleName: "", suffix: "" },
    age: "",
    religion: "",
    place_of_birth: "",
    permanent_address: {
      barangay: "",
      purok: "",
      street: "",
      municipality: "",
    },
    contact_number: "",
    email_address: "",
    educ_attainment: "",
    highest_grade_year: "",
    gwa: "",
    school_name: "",
    school_type: "",
    awards: [],
    father_status: "",
    father_name: "",
    father_address: "",
    father_occupation: "",
    mother_status: "",
    mother_name: "",
    mother_address: "",
    mother_occupation: "",
    gross_income: "",
    number_of_siblings: "",
    number_of_brothers: "",
    number_of_sisters: "",
    itrUrl: PreviewIcon,
    partner_name: "",
    number_of_children: "",
    partner_occupation: "",
    partner_course: "",
    eSignature: PreviewIcon,
  });
  const [awards, setAwards] = useState([
    { description: "", school: "", date: "" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const fileUploadRef = useRef();
  const itrUploadRef = useRef();
  const eSignatureUploadRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/submit_initial_requirements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        console.log(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Profile Upload Handler
  const handleImageUpload = () => fileUploadRef.current.click();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, avatarURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ITR Upload Handler
  const handleITRUpload = () => itrUploadRef.current.click();
  const handleITRFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          itrUrl: reader.result, // Store the uploaded file URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // E-Signature Upload Handler
  const handleESignatureUpload = () => eSignatureUploadRef.current.click();
  const handleESignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          eSignature: reader.result, // Store the uploaded file URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const Modal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-preview" onClick={onClose}>
            &times;
          </span>
          <img src={imageSrc} alt="Preview" className="full-size-image" />
        </div>
      </div>
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: { ...prevData[parent], [child]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      if (name === "educ_attainment") {
        setFormData((prevData) => ({
          ...prevData,
          highest_grade_year: "", // Reset dependent dropdown
        }));
      }
    }
  };

  const handleAwardChange = (index, field, value) => {
    const updatedAwards = [...awards];
    updatedAwards[index][field] = value;
    setAwards(updatedAwards);
    setFormData((prevData) => ({
      ...prevData,
      awards: updatedAwards,
    }));
  };

  const addAwardRow = () => {
    const newAwards = [...awards, { description: "", school: "", date: "" }];
    setAwards(newAwards);
    setFormData((prevData) => ({
      ...prevData,
      awards: newAwards,
    }));
  };

  const removeAwardRow = (index) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="application-header">
          <h2>DAET EXPANDED SCHOLARSHIP PROGRAM</h2>
          <p>(Per Municipal Ordinance No. 372 S. 2018)</p>
          <br />
          <h2>Application Form</h2>
          <hr style={{ border: "1px solid #000", marginTop: "10px" }} />
        </div>
        <div className="form-container">
          <div className="left-right">
            {/* Grant Applied For */}
            <div className="old_left">
              <div className="instructions">
                <h3>Instructions</h3>
                <p>1. Make sure to enter your information accurately.</p>
                <p>
                  2. Look for fields marked with an asterisk (*) or indicated as
                  required. These fields must be filled in to complete the form.
                </p>
              </div>
              <hr style={{ border: "1px solid #6D6767", marginTop: "10px" }} />
              <div className="grant-applied-for">
                <h3>GRANT APPLIED FOR:</h3>
                <div className="radio-options">
                  <RadioOption
                    id="degree-course"
                    name="grant_type"
                    value="Degree Course"
                    label="Degree Course"
                    checked={formData.grant_type === "Degree Course"}
                    onChange={handleChange}
                  />
                  <RadioOption
                    id="non-degree-course"
                    name="grant_type"
                    value="Non-Degree Course"
                    label="Non-Degree Course"
                    checked={formData.grant_type === "Non-Degree Course"}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Profile Photo */}
            <div className="old_right">
              <img
                src={formData.avatarURL}
                alt="Avatar"
                className="avatar-image"
                onClick={() => {
                  setSelectedImage(formData.avatarURL);
                  setIsModalOpen(true);
                }}
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="upload-button"
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileUploadRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div>
            <h3>Personal Information</h3>
            {/* Name Information */}
            <div className="personal-info">
              <p>Name:</p>
              <InputField
                id="app_id"
                label="Applicant ID"
                name="applicant_id"
                value={formData.applicant_id}
                onChange={handleChange}
              />
              <InputField
                id="lname"
                label="Last Name"
                name="name.lastName"
                value={formData.name.lastName}
                onChange={handleChange}
              />
              <InputField
                id="fname"
                label="First Name"
                name="name.firstName"
                value={formData.name.firstName}
                onChange={handleChange}
              />
              <InputField
                id="mname"
                label="Middle Name"
                name="name.middleName"
                value={formData.name.middleName}
                onChange={handleChange}
              />
              <InputField
                id="suffix"
                label="Suffix (if any)"
                name="name.suffix"
                value={formData.name.suffix}
                onChange={handleChange}
              />
            </div>

            {/* Demographics */}
            <div className="personal-info">
              <InputField
                id="age"
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
              <div className="info1-group">
                <label>Sex:</label>
                <RadioOption
                  id="female"
                  name="sexValue"
                  value="Female"
                  label="Female"
                  checked={formData.sexValue === "Female"}
                  onChange={handleChange}
                />
                <RadioOption
                  id="male"
                  name="sexValue"
                  value="Male"
                  label="Male"
                  checked={formData.sexValue === "Male"}
                  onChange={handleChange}
                />
              </div>
              <div className="info1-group">
                <label htmlFor="status">Civil Status:</label>
                <select
                  id="status"
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    -- Choose an option --
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <InputField
                id="religion"
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
              />
            </div>

            {/* Birth Information */}
            <div className="personal-info">
              <InputField
                id="birthdate"
                label="Birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
              />
              <InputField
                id="place_of_birth"
                label="Place of Birth"
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleChange}
              />
            </div>

            {/* Permanent Address Information */}
            <div className="personal-info">
              <p>Permanent Address:</p>
              <InputField
                id="barangay"
                label="Barangay"
                name="permanent_address.barangay"
                value={formData.permanent_address.barangay}
                onChange={handleChange}
              />
              <InputField
                id="purok"
                label="Purok"
                name="permanent_address.purok"
                value={formData.permanent_address.purok}
                onChange={handleChange}
              />
              <InputField
                id="street"
                label="Street"
                name="permanent_address.street"
                value={formData.permanent_address.street}
                onChange={handleChange}
              />
              <InputField
                id="municipality"
                label="Municipality"
                name="permanent_address.municipality"
                value={formData.permanent_address.municipality}
                onChange={handleChange}
              />
            </div>

            {/* Contact Information */}
            <div className="personal-info">
              <InputField
                id="contact_no"
                label="Contact Number"
                name="contact_number"
                type="number"
                value={formData.contact_number}
                onChange={handleChange}
              />
              <InputField
                id="email_address"
                label="Email Address"
                name="email_address"
                type="email"
                value={formData.email_address}
                onChange={handleChange}
              />
            </div>

            {/* Educational Attainment */}
            <div className="personal-info">
              <div className="info1-group">
                <label htmlFor="educ_attainment">
                  Highest Educational Attainment:
                </label>
                <select
                  id="educ_attainment"
                  name="educ_attainment"
                  value={formData.educ_attainment}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    -- Choose an option --
                  </option>
                  <option value="kindergarten">Kindergarten</option>
                  <option value="elementary">Elementary (grade 1-6)</option>
                  <option value="junior_high">Junior High (grade 7-10)</option>
                  <option value="senior_high">Senior High (grade 11-12)</option>
                  <option value="college">College Level</option>
                  <option value="als">Alternative Learning System (ALS)</option>
                </select>
              </div>
            </div>

            {/* Educational Attainment pt.2 */}
            <div className="personal-info">
              <div className="info1-group">
                <label htmlFor="highest_grade_year">Highest Grade/Year:</label>
                <select
                  id="highest_grade_year"
                  name="highest_grade_year"
                  value={formData.highest_grade_year}
                  onChange={handleChange}
                  disabled={!formData.educ_attainment} // Disable if no educational attainment is selected
                >
                  <option value="" disabled>
                    -- Choose an option --
                  </option>
                  {formData.educ_attainment &&
                    gradeYearOptions[formData.educ_attainment].map(
                      (option, index) => (
                        <option
                          key={index}
                          value={option.toLowerCase().replace(/\s+/g, "_")}
                        >
                          {option}
                        </option>
                      )
                    )}
                </select>
              </div>

              <InputField
                id="gwa"
                label="General Weighted Average (GWA):"
                name="gwa"
                type="number"
                value={formData.gwa}
                onChange={handleChange}
              />
            </div>

            {/* School Information */}
            <div className="personal-info">
              <InputField
                id="school_name"
                label="School Name"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
              />

              <div className="info1-group">
                <label>School Type:</label>
                <RadioOption
                  id="school_prublic"
                  name="school_type"
                  value="Public"
                  label="Public"
                  checked={formData.school_type === "Public"}
                  onChange={handleChange}
                />

                <RadioOption
                  id="school_private"
                  name="school_type"
                  value="Private"
                  label="Private"
                  checked={formData.school_type === "Private"}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Acadademic Award / Honors Received */}
            <h3>Academic Awards/ Honors Received</h3>
            <div>
              <table
                className="awards-table"
                border="1"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Nature/Description</th>
                    <th>School</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={award.description}
                          onChange={(e) =>
                            handleAwardChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter description"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={award.school}
                          onChange={(e) =>
                            handleAwardChange(index, "school", e.target.value)
                          }
                          placeholder="Enter school name"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={award.date}
                          onChange={(e) =>
                            handleAwardChange(index, "date", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="delete-row-btn"
                          onClick={() => removeAwardRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="add-row-btn"
                onClick={addAwardRow}
                style={{ marginTop: "10px" }}
              >
                Add Row
              </button>
            </div>

            {/* Family Background */}
            <h3>Family Background</h3>
            <div className="left-right">
              <div className="new_left">
                <div className="info1-group">
                  <label>Father:</label>
                  <RadioOption
                    id="father_living"
                    name="father_status"
                    value="Living"
                    label="Living"
                    checked={formData.father_status === "Living"}
                    onChange={handleChange}
                  />
                  <RadioOption
                    id="father_deceased"
                    name="father_status"
                    value="Deceased"
                    label="Deceased"
                    checked={formData.father_status === "Deceased"}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  id="father_name"
                  label="Name"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                />
                <InputField
                  id="father_address"
                  label="Address"
                  name="father_address"
                  value={formData.father_address}
                  onChange={handleChange}
                />
                <InputField
                  id="father_occupation"
                  label="Occupation"
                  name="father_occupation"
                  value={formData.father_occupation}
                  onChange={handleChange}
                />
              </div>
              <hr className="vertical-line" />
              <div className="new_right">
                <div className="info1-group">
                  <label>Mother:</label>
                  <RadioOption
                    id="mother_living"
                    name="mother_status"
                    value="Living"
                    label="Living"
                    checked={formData.mother_status === "Living"}
                    onChange={handleChange}
                  />
                  <RadioOption
                    id="mother_deceased"
                    name="mother_status"
                    value="Deceased"
                    label="Deceased"
                    checked={formData.mother_status === "Deceased"}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  id="mother_name"
                  label="Name"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                />
                <InputField
                  id="mother_address"
                  label="Address"
                  name="mother_address"
                  value={formData.mother_address}
                  onChange={handleChange}
                />
                <InputField
                  id="mother_occupation"
                  label="Occupation"
                  name="mother_occupation"
                  value={formData.mother_occupation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Family Income */}
            <div className="left-right">
              <div className="old_left">
                <div className="personal-info">
                  <InputField
                    id="gross_income"
                    label="Total of Bpth Parents Gross Income"
                    name="gross_income"
                    type="number"
                    value={formData.gross_income}
                    onChange={handleChange}
                  />
                  <InputField
                    id="children_in_family"
                    label="Number of Siblings in Family"
                    name="number_of_siblings"
                    type="number"
                    value={formData.number_of_siblings}
                    onChange={handleChange}
                  />
                </div>
                <div className="personal-info">
                  <InputField
                    id="brother"
                    label="No. of Brothers."
                    name="number_of_brothers"
                    type="number"
                    value={formData.number_of_brothers}
                    onChange={handleChange}
                  />
                  <InputField
                    id="sister"
                    label="No. of Sisters."
                    name="number_of_sisters"
                    type="number"
                    value={formData.number_of_sisters}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="old_right">
                <img
                  src={formData.itrUrl}
                  alt="ITR Preview"
                  className="itr-image"
                  onClick={() => {
                    setSelectedImage(formData.itrUrl);
                    setIsModalOpen(true);
                  }}
                />
                <p>
                  {formData.itrUrl != PreviewIcon
                    ? "File Uploaded."
                    : "Nothing's been uploaded yet."}
                </p>
                <button
                  type="button"
                  onClick={handleITRUpload}
                  className="upload-button"
                >
                  Upload Income Tax Return (ITR)
                </button>
                <input
                  type="file"
                  ref={itrUploadRef}
                  onChange={handleITRFileChange}
                  accept="application/pdf, image/*"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* MARRIED OR LIVING TOGETHER */}
            <h3>(FOR MARRIED OR LIVING TOGETHER APPLICANT ONLY)</h3>
            <div className="personal-info">
              <InputField
                id="partners_name"
                label="Name of Husband/Wife"
                name="partner_name"
                value={formData.partner_name}
                onChange={handleChange}
              />
              <InputField
                id="no_of_children"
                label="Number of Children"
                name="number_of_children"
                type="number"
                value={formData.number_of_children}
                onChange={handleChange}
              />
              <InputField
                id="parnters_occupation"
                label="Partner's Occupation"
                name="partner_occupation"
                value={formData.partner_occupation}
                onChange={handleChange}
              />
              <div className="info1-group">
                <label>Course Type:</label>
                <RadioOption
                  id="partners_course"
                  name="partner_course"
                  value="Degree Course"
                  label="Degree Course"
                  checked={formData.partner_course === "Degree Course"}
                  onChange={handleChange}
                />
                <RadioOption
                  id="partners_course"
                  name="partners_course"
                  value="Non-Degree Course"
                  label="Non-Degree Course"
                  checked={formData.partner_course === "Non-Degree Course"}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* E-Signature */}
            <div className="left-right">
              <div className="old_left"></div>
              <div className="old_right">
                <img
                  src={formData.eSignature}
                  alt="E-Signature Preview"
                  className="itr-image"
                  onClick={() => {
                    setSelectedImage(formData.eSignature);
                    setIsModalOpen(true);
                  }}
                />
                <p>
                  {formData.eSignature != PreviewIcon
                    ? "File Uploaded."
                    : "Nothing's been uploaded yet."}
                </p>
                <button
                  type="button"
                  onClick={handleESignatureUpload}
                  className="upload-button"
                >
                  Upload E-Signature
                </button>
                <input
                  type="file"
                  ref={eSignatureUploadRef}
                  onChange={handleESignatureFileChange}
                  accept="application/pdf, image/*"
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="submit-container">
          <button
            type="submit"
            onClick={() => console.log("formData:", formData)}
            className="submit-btn"
          >
            Submit
          </button>
        </div>
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageSrc={selectedImage}
          />
        </>
      </form>
    </>
  );
};

export default Registration;
