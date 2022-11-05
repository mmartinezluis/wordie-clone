import React from 'react';
import './App.css';
import Board from './components/Board';
// import logo from './logo.svg';

function App() {
  console.log("app was rendered")
  return (
    <div className="App">
      <h1>Wordle Clone</h1>
      <Board />
    </div>
  );
}

export default App;







