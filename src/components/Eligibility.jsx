import React from "react";
import "./Eligibility.css";

const Eligibility = () => {
  return (
    <section className="eligibility">
      <h2>Who can apply?</h2>
      <ol>
        <li>A resident of the Municipality of Daet;</li>
        <li>
          The parent or guardian is a registered voter in the municipality;
        </li>
        <li>
          <ul className="alphabet-lower">
            <li>
              For senior high school graduate with at least 80% average with no
              failing grade in any subject.
            </li>
            <li>
              For college level or college under graduate, must have a weighted
              average of at least 2.5 in the last semester in college and has
              not yet completed a tertiary course.
            </li>
          </ul>
        </li>
        <li>
          Has passed the entrance examination in the State College or private
          college where he or she intends to enroll;
        </li>
        <li>
          The combined gross annual income of parents/guardians must not be more
          than the latest poverty threshold;
        </li>
        <li>With good moral character and without any derogatory record;</li>
        <li>Does not have any scholarship or study grant.</li>
      </ol>
    </section>
  );
};

export default Eligibility;
