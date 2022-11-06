import React, {useCallback, useEffect, useRef, useState} from 'react';
import { 
  QUEUE, 
  COUNTER, 
  ALPHABET, 
  target_function,
  TARGET_MAP_CONSTANT, 
  PLACEHOLDERCOUNTER, 
  ATTEMPTS,
  BLANK,
  MISSED,
  CLOSE,
  RIGHT,
  INPUTS_MATRIX,
  ASSERTION_MATRIX
} from './gameSettings.js';
import { WORD_LIST } from '../lib/wordList.js';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import {keyboardLayout, keyboardDisplay, buttonTheme} from './keyboardConfig.js';
import { modalCodes } from '../App.js';

//*********** Board variables ****************
let queue, counter, TARGET, TARGET_MAP, placeHolderCounter, attempts;


const Board = ({ openModal, setIsOpen, setModalStatus, setModalText }) => {
  // Used to attach/dettach a keydown event listerner on the page
  const page = useRef(null);
  // User input characters matrix
  const [inputs, setInputs] = useState(INPUTS_MATRIX);
  // Color codes matrix (assertion matrix) for processed words
  const [assertion, setAssertion] = useState(ASSERTION_MATRIX);
  // Two variables are needed to successfully toggle the "glow" class name on a cell (editableCell variable)
  // and to read the id of the toggled cell in the detectKeyDown function (editableCellRef variable;
  // editableCell variable is an empty string in detectKeyDown function even after setting it to an id string on the cell's click event)
  const [editableCell, setEditableCell] = useState(BLANK);
  const editableCellRef = useRef(BLANK);
  // Used for setting color codes for keyboard keys
  const [dynamicButtonSettings, setDynamicButtonSettings] = useState(buttonTheme);

  const reinitialzeGame = () => {
    // Used for accessing the current row, namely, queue[0])
    queue = QUEUE;
    // Used for keeping track of next available position in current row
    counter = COUNTER;
    // the word to discover
    TARGET = target_function(WORD_LIST);
    // hash map for checking presence of a given character in target word in constant time
    TARGET_MAP = TARGET_MAP_CONSTANT;
    for(let char of TARGET) {
      // '1' means the character is in the string; not the count of the character
      TARGET_MAP[char] = 1;
    }
    // keeps track of number of placeholder characters in current row
    placeHolderCounter = PLACEHOLDERCOUNTER;
    // stores the user's processed words
    attempts = ATTEMPTS;
    setInputs(INPUTS_MATRIX);
    setAssertion(ASSERTION_MATRIX);
    setEditableCell(BLANK);
    editableCellRef.current = BLANK;
    setDynamicButtonSettings(buttonTheme);
  }

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

  const validWord = useCallback((row) => {
    return WORD_LIST.includes(inputs[row].join("").toLowerCase());
  },[inputs])

  const wonGame = useCallback(() => {
    queue = [];
    setModalText(`Congratulations!!!\n You got the word, ${TARGET}`);
    setModalStatus(modalCodes.won);
    setIsOpen(true);
  },[setModalText, setModalStatus, setIsOpen])

  const lostGame = useCallback(( ) => {
    setModalText(`Sorry, the word was ${TARGET}`);
    setModalStatus(modalCodes.lost);
    setIsOpen(true);
  },[setModalText, setModalStatus, setIsOpen])

  const clearEditable = () => {
    editableCellRef.current = "";
    setEditableCell("");
  }

  const editCell = useCallback((row, key) => {
    console.log("waiting on edits");
    // If user input is a placeholder and editable cell currently has a letter, increase placeholder count
    if(!ALPHABET[key] && inputs[row][editableCellRef.current[1]] !== "-") placeHolderCounter++;
    // If user input is a letter and editable cell currently has a placeholder, decrease placeholder count
    if(ALPHABET[key] && inputs[row][editableCellRef.current[1]] === "-" ) placeHolderCounter--;
    setInputs([...inputs, inputs[row][editableCellRef.current[1]] = ALPHABET[key] ? key : "-"]);
    clearEditable();
  },[inputs])

  const detectKeyDown = useCallback(async (e) => {
    // If no row to process, skip the function
    if(!queue.length) return;
    // 'e.key' comes from typing on device keyboard; 'e' alone comes from typing (clicking) on page keyboard
    const key = e.key ? e.key.toUpperCase() : e;
    const row = queue[0];
    console.log(key)
    if(key === 'ENTER') {
      if(placeHolderCounter > 0) {
        openModal("Please remove placeholders");
        return;
      }
      if(counter < 5) {
        openModal("Not enough letters");
        return;
      }
      if(!validWord(row)) {
        openModal("That's not in our dictionary");
        return;
      }
      if(attempts[inputs[row].join("")]) {
        openModal("You already used that word");
        return;
      }
      // Deactivate user input while processing word
      page.current.removeEventListener('keydown', detectKeyDown, false);
      // Deactivate editable cell click event
      queue[0] = undefined;
      // Remove editableCell selection if user had selected a cell before pressing Enter
      clearEditable();
      // Stop code execution until 'didWindGame and processWord' is done (uses promises + setTimeout)
      if(await didWinGame(row, inputs[row])) {
        wonGame();
        return;
      } else page.current.addEventListener('keydown', detectKeyDown, false);
      // Game was not won; remove access to current row and proceed to next row
      queue.shift();
      counter = 0;
      // If queue is empty, game is over
      if(!queue.length) {
        page.current.removeEventListener('keydown', detectKeyDown, false)
        lostGame();
        return;
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
    } else if(ALPHABET[key] || key === " " || key === "SPACE") {
      // If user had clicked on a non-empty cell in the current row, allow that cell to be editable with the user's last input
      if(editableCellRef.current.length) return editCell(row, key);
      if(counter > 4) return;
      setInputs([
        ...inputs, 
          inputs[row][counter] = (function(){
            if(ALPHABET[key]) {
              return key;
            } else {
              if(placeHolderCounter < 5) placeHolderCounter++;
              return "-";
            }
          })()
      ]);
      counter += 1;
    }
  },[inputs, editCell, didWinGame, openModal, validWord, wonGame, lostGame])

  useEffect(() => {
    // ensures that use effect runs only once
    if(!page.current) {
      reinitialzeGame();
      page.current = document;
      page.current.addEventListener('keydown', detectKeyDown, false);
    }
  },[detectKeyDown]);

  return (
    <div>
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
      {/* This is the keyboard */}
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

