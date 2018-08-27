import './app.css';
import logo from './Logo.png';
import Nabbar from '../navbar/navbar';
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
        <div>
            <Nabbar />
            <img className='logo' src={logo} alt='logo' />
            <div className='container'></div>
        </div>
    );
  }
}

export default App;
