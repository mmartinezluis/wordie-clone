import React, {
    useCallback, 
    useEffect, 
    useRef, 
    useState
} from 'react';

// Used for accessing the current row, namely, queue[0])
const queue = [0,1,2,3,4,5];
// Used for counting the characters in current row
let counter = 0;
let alphabet = {A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z'};
// const dictionary = {TARGET: "TARGET"};
const TARGET = "HELLO";
const TARGET_MAP = {};
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

// let cellToEdit = "";
    
const Board = () => {
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

  const processWord= useCallback((row, word_array) => {
    let correct = 0;
    (function delay(i) {
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
          delay(i);
        }
      }, 1000)
    })(TARGET.length)
    if(correct === TARGET.length) return 1;
    attempts[word_array.join("")] = 1;
    return 0;
  },[assertion])

  const didWinGame = useCallback((row, word_array) => {
    return processWord(row, word_array);
  },[processWord])

  function validWord(word) {
    // if(!dictionary[word]) return false;
    return true;
  }

  function display() {

  }

  function lostGame() {

  }

  const editCell = useCallback((row, key) => {
    console.log("waiting on edits");
    // If user input is a placeholder and editable cell currently has a letter, increase placeholder count
    if(!alphabet[key] && inputs[row][editableCellRef.current[1]] !== "-") placeHolderCounter++;
    // If user input is a letter and editable cell currently has a placeholder, decrease placeholder count
    if(alphabet[key] && inputs[row][editableCellRef.current[1]] === "-" ) placeHolderCounter--;
    setInputs([...inputs, inputs[row][editableCellRef.current[1]] = alphabet[key] ? key : "-"]);
    editableCellRef.current = "";
    setEditableCell("");
    return;
  },[inputs])

  const detectKeyDown = useCallback((e) => {
    // 'e.key' comes from typing on device keyborad; 'e' alone comes from typing (clicking) on page keyboard
    const key = e.key ? e.key.toUpperCase() : e;
    const row = queue[0];
    console.log(key)
    if(key === 'ENTER') {
      if(placeHolderCounter > 0) {
        display("Please remove placeholders");
        console.log("Please remove placeholders")
        return;
      }
      if(counter < 5) {
        display("Not enough letters");
        console.log("Not enough letters")
        return;
      }
      if(!validWord(key)) {
        display("That's not in our dictionary");
        console.log("That's not in our dictionary");
        return;
      }
      if(attempts[inputs[row].join("")]) {
        display("You already used that word");
        console.log("You already used that word");
        return;
      }
      if(didWinGame(row, inputs[row])) {
        display("Congratulations!!!")
        return;
      };
      // Game was not won; remove access to current row and proceed to next row
      queue.shift();
      counter = 0;
      if(!queue.length) {
        lostGame();
        display("The word was", TARGET);
        console.log("The word was", TARGET);
        // @TODO remove keydown event listener
        document.removeEventListener('keydown', detectKeyDown, true)
      }
    } else if(key === 'BACKSPACE') {
      if(counter > 0 && counter <= 5) {
        counter -= 1;
        if(inputs[row][counter] === "-") placeHolderCounter--;
        setInputs([...inputs, inputs[row][counter] = ""]);
        // If user pressed backspace after clicking on an editable cell, deactivate the editable cell
        if(editableCellRef.current.length) {
          editableCellRef.current = "";
          setEditableCell("");
        }
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
  },[didWinGame, inputs, editCell])


  useEffect(() => {
    // Ensures that use effect runs only once
    if(!page.current) {
      page.current = document;
      page.current.addEventListener('keydown', detectKeyDown, false);
    }
  },[detectKeyDown]);

  
  return (
    <>
    Editable is now {editableCell}
    <div className='board' style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        {new Array(6).fill(0).map((row_el, row_index) => {
            return (
            <div key={row_index} className='row' style={{display: 'flex'}}>
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
                            style={{border: 'black solid 1.5px', width: '50px', height: '50px', display: 'flex', justifyContent:'center', alignItems:'center', margin: '5px'}}
                        >
                            {inputs[row_index][col_index]}    
                        </div>
                    )
                })}
            </div>
            )
        })}
    </div>
    </>
  )
}

// export const detectKeyDown

export default Board;

