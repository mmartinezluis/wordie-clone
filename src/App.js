import React, {useCallback, useEffect, useState} from 'react';
// import logo from './logo.svg';
import './App.css';


const queue = [0,1,2,3,4,5];
let counter = 0;
let alphabet = {A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z'};
const dictionary = {};

function App() {

  const inputs = new Array(6).fill(0).map(el => new Array(6).fill(""));

  const detectKeyDown = (e) => {
    const key = e.key.toUpperCase();
    const row = queue[0];
    
    console.log(key)
    if(key === 'ENTER') {
      if(counter < 5) {
        display("Not enough letters");
        return;
      }
      if(!validWord(key)) {
        display("That's not in our dictionary");
        return;
      }
      if(didWinGame()) {
        display("Congratulations!!!")
        return;
      };
      queue.shift();
      counter = 0;
      if(!queue.length) {
        lostGame();
        display("The word was", "WORD");
        // @TODO remove keydown event listener
      }
    } else if(key === 'BACKSPACE') {
      if(counter > 0 && counter < 5) {
        inputs[row][counter] = "";
        counter -= 1;
      }
    } else if(alphabet[key]) {
      // console.log(inputs)
      if(counter > 4) return;
      inputs[row][counter] = key;
      counter += 1;
    }
  }

  useEffect(() => {
    console.log("in use effect")
    document.addEventListener('keydown', detectKeyDown, true)
    // return () => {
    //   document.removeEventListener('keydown', {}, undefined)
    // };
  }, []);

  // const [letters, setLetters] = useState("");
  // useEffect(() => {
  //   setLetters(inputs)
  // },[inputs])




  function validWord(word) {
    return true;
  }

  function display() {

  }

  function didWinGame() {
    processWord();
  }

  function processWord() {

  }

  function lostGame() {

  }

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.          
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    <h1>Wordie Clone</h1>
    <Board 
      inputs={inputs}
    />
    </div>
  );
}

export default App;


console.log("APP rendered")
const Board = ({inputs}) => {
  console.log(inputs)
  return(
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {new Array(6).fill(0).map((row_el, row_index) => {
        return (
          <div key={row_index} className='row' style={{display: 'flex'}}>
            {new Array(5).fill(0).map((col_el, col_index) => {
              return(
                <div key={row_index + col_index} className='cell' style={{border: 'black solid 1.5px', width: '50px', height: '50px', display: 'flex', justifyContent:'center', alignItems:'center', margin: '5px'}}>
                  {inputs[row_index]}{inputs[col_index]}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
