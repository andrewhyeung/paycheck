import React, { Component } from 'react';
import logo from './logo.svg'
import './App.css';
import SalaryInput from './components/SalaryInput';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Paycheck Calculator</h1>
          <hr />  
        </header>
        <SalaryInput amount='50,000' />
      </div>
    );
  }
}

export default App;
