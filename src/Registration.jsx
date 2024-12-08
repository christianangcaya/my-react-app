import React, { useState, useRef } from "react";
import "./Registration.css";
import DefaultImage from "./assets/pfp_placeholder.png";

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
    grantType: "",
    sexValue: "",
    civilStatus: "",
    birthdate: "",
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
    contact_no: "",
    email_address: "",
    educ_attainment: "",
    highest_grade_year: "",
    gwa: "",
    school_name: "",
    school_type: "",
  });

  const fileUploadRef = useRef();

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

  return (
    <>
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
          <div className="left">
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
                  name="grantType"
                  value="Degree Course"
                  label="Degree Course"
                  checked={formData.grantType === "Degree Course"}
                  onChange={handleChange}
                />
                <RadioOption
                  id="non-degree-course"
                  name="grantType"
                  value="Non-Degree Course"
                  label="Non-Degree Course"
                  checked={formData.grantType === "Non-Degree Course"}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {/* Profile Photo */}
          <div className="right">
            <img
              src={formData.avatarURL}
              alt="Avatar"
              className="avatar-image"
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
          <h1>Personal Information</h1>
          {/* Name Information */}
          <div className="personal-info">
            <p>Name:</p>
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
              name="contact_no"
              type="number"
              value={formData.contact_no}
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
                id="school_type"
                name="school_type"
                value="Public"
                label="Public"
                checked={formData.school_type === "Public"}
                onChange={handleChange}
              />

              <RadioOption
                id="school_type"
                name="school_type"
                value="Private"
                label="Private"
                checked={formData.school_type === "Private"}
                onChange={handleChange}
              />
            </div>
          </div>

          <h1>Academic Awards/ Honors Received</h1>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Registration;
