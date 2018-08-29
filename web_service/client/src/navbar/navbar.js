// import "../../node_modules/materialize-css/dist/css/materialize.css";

import React, { Component } from "react";
import Logo from "../assets/Logo.png";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand mr-10" href="#">
          <img src={Logo} width="150" height="42" />
        </a>
        {/*
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        */}

        <form>
          <div className="form-row align-items-center d-flex justify-content-center">
            <div className="col-md-8 col-sm-4 pr-0 col-6">
              <input
                type="text"
                className="form-control"
                id="inlineFormInputName"
                placeholder="Search"
              />
            </div>
            <div className="col-auto my-1 pl-0">
              <button type="submit" className="btn btn-secondary">
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="collapse navbar-collapse" id="navbarSupportedContent" />
      </nav>
    );
  }
}

export default NavBar;
