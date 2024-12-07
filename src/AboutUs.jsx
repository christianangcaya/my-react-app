import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      <header className="header">
        <h1>E-Scholarship Application System</h1>
        <p>LOCAL GOVERNMENT UNIT - DAET</p>
      </header>

      <div className="content">
        <img
          src="/path-to-your-image.jpg" 
          alt="Scholarship Group"
          className="about-image"
        />
        <p>
          The <strong>LGU-Daet Scholarship Program</strong> is a dedicated
          initiative by the Local Government Unit of Daet aimed at empowering
          deserving students by providing financial assistance of PHP 5,000 per
          semester. The program plays a vital role in promoting access to
          education for underprivileged yet talented individuals. Each school
          year, an examination is conducted to identify new applicants, with
          the number of slots determined by the graduates from the previous
          year and the available funds allocated by the municipal mayor. The
          program currently supports 1,025 scholars, demonstrating its
          significant contribution to the educational advancement and social
          development of the municipality.
        </p>

        <div className="mission-vision">
          <div className="mission">
            <h2>MISSION</h2>
            <p>
              The Municipality of Daet shall take the <strong>lead</strong> in
              the implementation of programs, projects, and activities,
              encourage community mobilization, and sustain the development of
              human and natural resources through strong moral and political
              will with full support of its constituency.
            </p>
          </div>
          <div className="vision">
            <h2>VISION</h2>
            <p>
              Daet is the <strong>Philippines’ friendship city</strong>, the
              service and commercial center of Camarines Norte, endowed with
              rich culture, balanced ecosystem, and vibrant economy sustained
              by empowered, God-loving citizens living a quality meaningful
              life in a city of character with properly managed safe built
              environment governed by morally upright and dedicated leaders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
