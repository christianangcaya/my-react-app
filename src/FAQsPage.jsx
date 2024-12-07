import React, { useState } from "react";

const faqs = [
  {
    question: "What is the LGU Daet Scholarship Program?",
    answer:
      "The LGU Daet Scholarship Program is a financial assistance program offered by the Local Government Unit of Daet to deserving students from the municipality. It aims to help students pursue their higher education and contribute to the development of the community."
  },
  {
    question: "Who is eligible to apply for the LGU Daet Scholarship?",
    answer: `2.1. A resident of the Municipality of Daet;
    2.2. The parent or guardian is a registered voter in the municipality;
    2.3. a. For senior high school graduates, at least 80% average with no failing grade in any subject.
         b. For college level or undergraduates, a weighted average of at least 2.5 in the last semester in college and has not yet completed a tertiary course;
    2.4. Has passed the entrance examination in the State College or private college where he or she intends to enroll;
    2.5. The combined gross annual income of parents/guardians must not exceed the latest poverty threshold;
    2.6. With good moral character and without any derogatory record;
    2.7. Does not have any other scholarship or study grant.`
  },
  {
    question: "When is the application period for the LGU Daet Scholarship?",
    answer:
      "The start of the application period will be announced on the Facebook page of LGU Daet Scholar. You can visit them at Lgu-Daet Expanded Scholarship Program."
  },
  {
    question: "What are the requirements needed for this program?",
    answer:
      "The specific requirements for the program have not been detailed in this FAQ. Please refer to the official guidelines provided by LGU Daet for the complete list of requirements."
  },
  {
    question: "How do I submit my application requirements?",
    answer:
      "If you’re done filling out and uploading the necessary documents, you will be able to see a SUBMIT button where you can pass your finished requirements."
  },
  {
    question:
      "I grew up not knowing who my father/mother is. The system requires me to provide this information. How will I proceed?",
    answer:
      "In the Civil Status/Remarks component of the system, you can select Unknown or Deceased, depending on your situation. These options do not require details about the parent."
  },
  {
    question: "I forgot to take note of my Application ID. How do I get it?",
    answer:
      "You can find your Application ID by opening the link that was sent to the email address you used when you registered in the online system. Take note of it. You need your Application ID to be able to sign in to the system to access your application form."
  }
];

// FAQ Component
const FAQsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle the visibility of the answer
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>LGU Daet Scholarship Program - FAQs</h1>
      <div>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3
              onClick={() => toggleFAQ(index)}
              style={{ cursor: "pointer", color: "#007BFF" }}
            >
              {faq.question}
            </h3>
            {activeIndex === index && (
              <p style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsPage;
