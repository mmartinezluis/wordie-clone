import React, {useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {
    "effect"
    return () => {
      // cleanup
    };
  }, []);
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
    <Board />
    </div>
  );
}

export default App;



const Board = () => {
  return(
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {new Array(6).fill(0).map((row_el, row_index) => {
        return (
          <div className='row' style={{display: 'flex'}}>
            {new Array(5).fill(0).map((col_el, col_index) => {
              return(
                <div className='cell' style={{border: 'black solid 1.5px', width: '50px', height: '50px'}}>
                  {row_index}{col_index}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
