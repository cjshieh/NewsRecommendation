import React from "react";
import "./spinner.css";

const spinner = ({firstLoad}) => {
  return (
    <div className={firstLoad ? "spiner-container full" : "spiner-container"}>
      <div className="row">
        <div className="lds-dual-ring" />
        <div className="content">Loading...</div>
      </div>
    </div>
  );
};

export default spinner;
