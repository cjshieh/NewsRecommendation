// import "../../node_modules/materialize-css/dist/css/materialize.css";

import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="#!" className="brand-logo">
            Logo
          </a>
          {/*
          <form>
            <div className="input-field">
              <input id="search" type="search" />
              <label className="label-icon" htmlFor="search">
                <i className="material-icons">search</i>
              </label>
              <i className="material-icons">close</i>
            </div>
          </form>
          */}
          <ul id="nav-mobile" className="right">
            <li>
              <a href="#!">Login</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
