import React from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {

  console.log(document.querySelector('.App-logo'))

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className='loginForm'>

      </div>
    </div>
  );
}

export default App;
