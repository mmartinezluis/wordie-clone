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
  inputs_matrix,
  assertion_matrix
} from './gameSettings.js';
import { WORD_LIST } from '../lib/wordList.js';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import {keyboardLayout, keyboardDisplay, buttonTheme_function} from './keyboardConfig.js';
import { modalCodes } from '../App.js';

//*********** Board stateless variables ****************
let queue, 
    counter, 
    target, 
    target_map, 
    placeHolderCounter, 
    attempts,
    inputs,
    assertion

//*********** Keyboard stateless variable ****************
let dynamicButtonSettings;

const Board = ({ openModal, setIsOpen, setModalStatus, setModalText, clearModal }) => {
  // Used to attach/dettach a keydown event listerner on the page
  const page = useRef(null);
  const boardRef = useRef(null);
  // Takes care of re-redering the component when stateless variables are changed
  const [inputsHandle, setInputsHandle] = useState(false);
  // Two variables are needed to successfully toggle the "glow" class name on a cell (editableCell variable)
  // and to read the id of the toggled cell in the detectKeyDown function (editableCellRef variable;
  // editableCell variable is an empty string in detectKeyDown function even after setting it to an id string on the cell's click event)
  const [editableCell, setEditableCell] = useState(BLANK);
  const editableCellRef = useRef(BLANK);
  
  const processWord= useCallback(async (row, word_array) => {
    let correct = 0;
    const steps = target.length;
    const step_delay = 400;
    // create a delayedSteps function, which runs a loop, each loop step taking a step_delay time to execute
    function delayedSteps(i) {
       setTimeout(function() {
        const index = target.length - i;
        if(i--) {
          // this logic adds background color to current row cells one character at a time
          if(!target_map[word_array[index]]){ 
            assertion[row][index] = MISSED;
            setInputsHandle((prev) => !prev)
          } else if(word_array[index] === target[index]) {
            assertion[row][index] = RIGHT;
            correct++;
            setInputsHandle((prev) => !prev)
          } else {
            assertion[row][index] = CLOSE;
            setInputsHandle((prev) => !prev)
          }
          delayedSteps(i);
        } 
      }, i === steps ? 300 : step_delay)
    }
    // promise + below setTimeout ensures program stops further code execution until done with the processWord function
    return new Promise(resolve => {
        // fires after first time option in time argument
        delayedSteps(steps);
        // fires after the step*step_delay time product 
        setTimeout(() => {  
          // this loop adds background color to the page's keyboard keys
          const clone = new Map(dynamicButtonSettings);
          for(let [index,code] of assertion[row].entries()) {
            
            clone.set(code, {
              ...clone.get(code), 
                buttons: inputs[row][index] + " " + clone.get(code).buttons.trim().slice()
            })
          }
          dynamicButtonSettings = clone;
          setInputsHandle((prev) => !prev);
          if(correct === target.length) return resolve(1);
          attempts[word_array.join("")] = 1;
          return resolve(0);
        }, steps*step_delay + 500)
    })
  },[])

  const didWinGame = useCallback(async (row, word_array) => {
    return processWord(row, word_array);
  },[processWord])

  const validWord = useCallback((row) => {
    return WORD_LIST.includes(inputs[row].join("").toLowerCase());
  },[])

  const wonGame = useCallback(() => {
    queue = [];
    setModalText(`Congratulations!!!\n You got the word, ${target}`);
    setModalStatus(modalCodes.won);
    setIsOpen(true);
  },[setModalText, setModalStatus, setIsOpen])

  const lostGame = useCallback(( ) => {
    setModalText(`Sorry, the word was ${target}`);
    setModalStatus(modalCodes.lost);
    setIsOpen(true);
  },[setModalText, setModalStatus, setIsOpen])

  const clearEditable = () => {
    editableCellRef.current = BLANK;
    setEditableCell(BLANK);
  }

  const editCell = useCallback((row, key) => {
    console.log("waiting on edits");
    // If user input is a placeholder and editable cell currently has a letter, increase placeholder count
    if(!ALPHABET[key] && inputs[row][editableCellRef.current[1]] !== "-") placeHolderCounter++;
    // If user input is a letter and editable cell currently has a placeholder, decrease placeholder count
    if(ALPHABET[key] && inputs[row][editableCellRef.current[1]] === "-" ) placeHolderCounter--;
    inputs[row][editableCellRef.current[1]] = ALPHABET[key] ? key : "-";
    clearEditable();
  },[])

  const detectKeyDown = useCallback(async (e) => {
    console.log(inputs, queue, inputsHandle)
    console.log('current target', target, "\ntarget map is", target_map);
    // If no row to process, skip the function
    // if(!queue.length) return;
    if(queue[0] === undefined) return;
    // 'e.key' comes from typing on user's device keyboard; 'e' alone comes from typing (clicking) on page keyboard
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
      // page.current.removeEventListener('keydown', detectKeyDown, true);
      // Deactivate editable cell click event
      queue[0] = undefined;
      // Remove editableCell selection if user had selected a cell before pressing Enter
      clearEditable();
      // Stop code execution until 'didWindGame' and 'processWord' are done (use promises + setTimeout)
      if(await didWinGame(row, inputs[row])) {
        wonGame();
        return;
      }  
      // tricky; add the eventlistner back only if user presses Enter using their device keyboard;
      // the page keyboard seems to add an event listener on the page automatically on pressing enter; hence, adding the event again will cause double typing for every key pressed on users' device keyboard
      // if(e.key) page.current.addEventListener('keydown', detectKeyDown, true);
      // Game was not won; remove access to current row and proceed to next row
      queue.shift();
      counter = 0;
      // If queue is empty, game is over
      if(!queue.length) {
        page.current.removeEventListener('keydown', detectKeyDown, true)
        lostGame();
        return;
      }
    } else if(key === 'BACKSPACE') {
      if(counter > 0 && counter <= 5) {
        counter -= 1;
        if(inputs[row][counter] === "-") placeHolderCounter--;
        inputs[row][counter] = "";
        setInputsHandle((prev) => !prev);
        // If user pressed backspace after clicking on an editable cell, deactivate the editable cell
        if(editableCellRef.current.length) clearEditable();
        return;
      }
    } else if(ALPHABET[key] || key === " " || key === "SPACE") {
      // If user had clicked on a non-empty cell in the current row, edit that cell with the user's last input
      if(editableCellRef.current.length) return editCell(row, key);
      if(counter > 4) return;
      if(ALPHABET[key]) {
        inputs[row][counter] = key;  
      } else {
        if(placeHolderCounter < 5) placeHolderCounter++;
        inputs[row][counter] = "-";
      }
      setInputsHandle((prev) => !prev);
      counter += 1;
    }
  },[editCell, didWinGame, openModal, validWord, wonGame, lostGame, inputsHandle])

  const reinitialzeGame = useCallback(() => {
    // if user wins or loses, the queue will be empty and the board will not be accessible; re-enable the board and keyboard
    // if user re-starts the game before finishing game, event listener will be active, hence there is no need to add event listener in this case 
    // if(queue && !queue.length) page.current.addEventListener('keydown', detectKeyDown, true);
    // Used for accessing the current row, namely, queue[0])
    queue = [...QUEUE];
    // Used for keeping track of next available position in current row
    counter = COUNTER;
    // the word to discover
    target = target_function(WORD_LIST);
    // hash map for checking presence of a given character in target word in constant time
    target_map = {...TARGET_MAP_CONSTANT};
    for(let char of target) {
      // '1' means the character is in the string; not the count of the character
      target_map[char] = 1;
    }
    // keeps track of number of placeholder characters in current row
    placeHolderCounter = PLACEHOLDERCOUNTER;
    // stores the user's processed words
    attempts = {...ATTEMPTS};
    // User inputs matrix
    inputs = inputs_matrix();
    // Color codes matrix (assertion matrix) for processed words
    assertion = assertion_matrix();
    // Used for setting color codes for page keyboard keys
    dynamicButtonSettings = buttonTheme_function();
    // reinitializes the editable cell
    clearEditable();
    // reinitializes the modal
    clearModal();
    setInputsHandle((prev) => !prev);
  },[clearModal])

  useEffect(() => {
    // ensures that code inside conditional runs only once, on page load
    if(!page.current) {
      reinitialzeGame();
      page.current = document;
      page.current.addEventListener('keydown', detectKeyDown, true);
    }
  },[reinitialzeGame, detectKeyDown]);

  console.log("board was rendered")
  if(!page.current) return <div></div>
  return (
    <div>
      {/* This button is placed in the app header using CSS */}
      <div className='new_game'>
        <button onClick={() => {
            reinitialzeGame();
            // boardRef.current.focus();
          }}
        >
          New Game
        </button>
      </div>
      {/* This is the board */}
      <div ref={boardRef} className='board'>
          {new Array(6).fill(0).map((row_el, row_index) => {
              return (
              <div key={row_index} className='row'>
                  {new Array(5).fill(0).map((col_el, col_index) => {
                      const cell_id = "" + row_index + col_index;
                      return (
                          <div 
                              onClick={(e) => {
                                if(row_index === queue[0] && inputs[row_index][col_index] !== "") {
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
        buttonTheme={[...dynamicButtonSettings.values()]}
        onKeyPress={(button) => {
          detectKeyDown(button)
          if(button === "ENTER") {
            page.current.removeEventListener('keydown', detectKeyDown, true);
          }
        }}
      />
    </div>
  )
}

export default Board;

