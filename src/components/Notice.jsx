import React from "react";
import "./Notice.css";

const Notice = () => {
  return (
    <div className="notice">
      <h3>NOTICE!</h3>
      <div className="curved-edge">
        <p className="notice-title">No To Multiple Accounts!!</p>
        <p>
          Please ensure that each user has only one account to avoid duplication
          and confusion in the system.
        </p>
      </div>
      <ul>
        <li>
          <strong>Valid Email Address:</strong> Use a valid email address for
          communication and verification purposes to ensure you receive
          important updates and information.
        </li>
        <li>
          <strong>Working Mobile Number/s:</strong> Provide a working mobile
          number to facilitate communication and for any necessary account
          verification.
        </li>
        <li>
          <strong>Stable Internet Connection:</strong> Ensure a stable internet
          connection to maintain uninterrupted access to services and avoid
          connectivity issues.
        </li>
      </ul>
    </div>
  );
};

export default Notice;
