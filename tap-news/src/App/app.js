
import React, { Component } from "react";
import logo from './Logo.png';
import './app.css';

class App extends Component {
  render() {
    return (
        <div>
            <img className='logo' src={logo} alt='logo' />
            <div className='container'></div>
        </div>
    );
  }
}

export default App;
