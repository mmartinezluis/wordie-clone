import React, {useCallback,useEffect,useRef,useState} from 'react';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import {keyboardLayout,keyboardDisplay} from './keyboardConfig.js';
import { WORD_LIST } from '../lib/wordList.js';

//*********** Board variables ****************
// Used for accessing the current row, namely, queue[0])
let queue = [0,1,2,3,4,5];
// Used for counting the characters in current row
let counter = 0;
let alphabet = {A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z'};
let TARGET = WORD_LIST[Math.floor(Math.random()*(WORD_LIST.length))].toUpperCase();
let TARGET_MAP = {};
for(let char of TARGET) {
    // '1' means the character is in the string; not the count of the character
    TARGET_MAP[char] = 1;
}
let placeHolderCounter = 0;
// Stores the user's processed words
const attempts = {};
// Used as inputs in the assertion matrix below
const BLANK = "";
const MISSED = "missed";
const CLOSE = "close";
const RIGHT = "right";

//*********** Keyboard variables ****************
// Keyboard dynamic settings
const buttonTheme = [
  {class: MISSED, buttons: " "},
  {class: CLOSE, buttons: " "},
  {class: RIGHT, buttons: " "}
]

    
const Board = ({openModal}) => {
  // Used to attach/dettach a keydown event listerner on the page
  const page = useRef(null);
  // User input characters matrix
  const [inputs, setInputs] = useState(new Array(6).fill(0).map(el => new Array(5).fill("")));
  // Color codes matrix (assertion matrix) for processed words
  const [assertion, setAssertion] = useState(new Array(6).fill(0).map(el => new Array(5).fill(BLANK)));
  // Two variables are needed to successfully toggle the "glow" class name on a cell (editableCell variable)
  // and to read the id of the toggled cell in the detectKeyDown function (editableCellRef variable;
  // editableCell variable is an empty string in detectKeyDown function even after setting it to an id string on the cell's click event)
  const [editableCell, setEditableCell] = useState("");
  const editableCellRef = useRef("");
  // Used for setting color codes for keyboard keys
  const [dynamicButtonSettings, setDynamicButtonSettings] = useState(buttonTheme);


  const processWord= useCallback(async (row, word_array) => {
    let correct = 0;
    const steps = TARGET.length;
    const step_delay = 400;
    // create a delayedSteps function, which runs a loop, each loop step taking a step_delay time to execute
    function delayedSteps(i) {
       setTimeout(function() {
        const index = TARGET.length - i;
        if(i--) {
          if(!TARGET_MAP[word_array[index]]){ 
            setAssertion([...assertion, assertion[row][index] = MISSED ]);
          } else if(word_array[index] === TARGET[index]) {
            setAssertion([...assertion, assertion[row][index] = RIGHT]);
            correct++;
          } else {
            setAssertion([...assertion, assertion[row][index] = CLOSE]);
          }
          delayedSteps(i);
        } 
      }, i === steps ? 300 : step_delay)
    }
    return new Promise(resolve => {
        // fires after first time option in time argument
        delayedSteps(steps);
        // fires after the step*step_delay time product 
        setTimeout(() => {  
          console.log('response is', correct)
          let temp;
          for(let [index,code] of assertion[row].entries()) setDynamicButtonSettings([...dynamicButtonSettings, dynamicButtonSettings[temp = code === "missed" ? 0 : code === "close" ? 1 : 2].buttons= inputs[row][index] + " " + dynamicButtonSettings[temp].buttons.trim() ]);
          if(correct === TARGET.length) return resolve(1);
          attempts[word_array.join("")] = 1;
          return resolve(0);
        }, steps*step_delay + 500)
    })
  },[assertion, dynamicButtonSettings, inputs])

  const didWinGame = useCallback(async (row, word_array) => {
    return processWord(row, word_array);
  },[processWord])

  function validWord(row) {
    return WORD_LIST.includes(inputs[row].join("").toLowerCase());
  }

  const lostGame = useCallback( () => {
    openModal("The word was", TARGET);
    console.log("The word was", TARGET);
    page.current.removeEventListener('keydown', detectKeyDown, false)
  },[])

  const clearEditable = () => {
    editableCellRef.current = "";
    setEditableCell("");
  }

  const editCell = useCallback((row, key) => {
    console.log("waiting on edits");
    // If user input is a placeholder and editable cell currently has a letter, increase placeholder count
    if(!alphabet[key] && inputs[row][editableCellRef.current[1]] !== "-") placeHolderCounter++;
    // If user input is a letter and editable cell currently has a placeholder, decrease placeholder count
    if(alphabet[key] && inputs[row][editableCellRef.current[1]] === "-" ) placeHolderCounter--;
    setInputs([...inputs, inputs[row][editableCellRef.current[1]] = alphabet[key] ? key : "-"]);
    clearEditable();
  },[inputs])


  const detectKeyDown = useCallback(async (e) => {
    // If no row to process, skip the function
    if(!queue.length) return;
    // 'e.key' comes from typing on device keyborad; 'e' alone comes from typing (clicking) on page keyboard
    const key = e.key ? e.key.toUpperCase() : e;
    const row = queue[0];
    console.log(key)
    if(key === 'ENTER') {
      if(placeHolderCounter > 0) {
        openModal("Please remove placeholders");
        console.log("Please remove placeholders")
        return;
      }
      if(counter < 5) {
        openModal("Not enough letters");
        console.log("Not enough letters")
        return;
      }
      if(!validWord(row)) {
        openModal("That's not in our dictionary");
        console.log("That's not in our dictionary");
        return;
      }
      if(attempts[inputs[row].join("")]) {
        openModal("You already used that word");
        console.log("You already used that word");
        return;
      }
      // Deactivate user input while processing word
      page.current.removeEventListener('keydown', detectKeyDown, false);
      // Deactivate editable cell click event
      queue[0] = undefined;
      // Remove editableCell selection if user had selected a cell before pressing Enter
      clearEditable();
      // Stop code execution until 'processWord' is done (uses promises + setTimeout)
      const didWinGame = await processWord(row, inputs[row]);
      console.log(didWinGame)
      if(didWinGame) {
        queue = [];
        openModal("Congratulations!!!")
        console.log("Congratulations")
        return;
      } else page.current.addEventListener('keydown', detectKeyDown, false);
      // Game was not won; remove access to current row and proceed to next row
      queue.shift();
      counter = 0;
      if(!queue.length) {
        lostGame();
      }
    } else if(key === 'BACKSPACE') {
      if(counter > 0 && counter <= 5) {
        counter -= 1;
        if(inputs[row][counter] === "-") placeHolderCounter--;
        setInputs([...inputs, inputs[row][counter] = ""]);
        // If user pressed backspace after clicking on an editable cell, deactivate the editable cell
        if(editableCellRef.current.length) clearEditable();
        return;
      }
    } else if(alphabet[key] || key === " " || key === "SPACE") {
      // If user had clicked on a non-empty cell in the current row, allow that cell to be editable with the user's last input
      if(editableCellRef.current.length) return editCell(row, key);
      if(counter > 4) return;
      setInputs([
        ...inputs, 
          inputs[row][counter] = (function(){
            if(alphabet[key]) {
              return key;
            } else {
              if(placeHolderCounter < 5) placeHolderCounter++;
              return "-";
            }
          })()
      ]);
      counter += 1;
    }
  },[inputs, editCell, processWord, lostGame, openModal, validWord])


  useEffect(() => {
    // ensures that use effect runs only once
    if(!page.current) {
      page.current = document;
      page.current.addEventListener('keydown', detectKeyDown, false);
    }
  },[detectKeyDown]);

  
  return (
    <div>
      GUESS: {TARGET}
      {/* This is the board */}
      <div className='board'>
          {new Array(6).fill(0).map((row_el, row_index) => {
              return (
              <div key={row_index} className='row'>
                  {new Array(5).fill(0).map((col_el, col_index) => {
                      const cell_id = "" + row_index + col_index;
                      return (
                          <div 
                              onClick={(e) => {
                                if(row_index === queue[0] && inputs[row_index][col_index] !== "") {
                                  console.log(e.target)
                                  editableCellRef.current = cell_id;
                                  setEditableCell(cell_id) 
                                } 
                              }} 
                              dataid={cell_id}
                              key={parseInt(cell_id)} 
                              className={`cell ${assertion[row_index][col_index]} ${editableCell === cell_id ? "glow" : ""}`} 
                          >
                              {inputs[row_index][col_index]}    
                          </div>
                      )
                  })}
              </div>
              )
          })}
      </div>
      <Keyboard 
        layout={keyboardLayout}
        layoutName="default"
        display={keyboardDisplay}
        buttonTheme={dynamicButtonSettings}
        onKeyPress={detectKeyDown}
      />
    </div>
  )
}


export default Board;

