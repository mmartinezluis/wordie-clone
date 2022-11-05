import React from 'react';
import './App.css';
import Board from './components/Board';
import KeyBoard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import {keyboardLayout, keyboardDisplay}  from './keyboard.js';

// import logo from './logo.svg';

function App() {
  console.log("app was rendered")
  return (
    <div className="App">
      <h1>Wordle Clone</h1>
      {/* <button onClick={() => console.log("ehh")}>HEY</button> */}
      <Board 
        // inputs={inputs}
        // assertion={assertion}
        // editCell={editCell}
        // editablecell={editablecell}
      />
      <KeyBoard 
        layout={keyboardLayout}
        layoutName="default"
        display={keyboardDisplay}
        // onKeyPress={detectKeyDown}
      />
    </div>
  );
}

export default App;







