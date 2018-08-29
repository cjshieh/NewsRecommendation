import './app.css';
import logo from '../assets/Logo.png';
// import Nabbar from '../navbar/navbar';
import React, { Component } from "react";
import NewsPanel from '../newsPanel/newsPanel';

class App extends Component {
  render() {
    return (
        <div>
            { /* <Nabbar />*/ }
            <img className='logo' src={logo} alt='logo' />
            <div className='container'>
              <NewsPanel />
            </div>
        </div>
    );
  }
}

export default App;
