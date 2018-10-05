import React from "react";
import "./spinner.css";

const spinner = () => {
  return (
    <div className="spiner-container">
      <div className="row">
        <div className="lds-dual-ring" />
        <div className="content">Loading...</div>
      </div>
    </div>
  );
};

export default spinner;
