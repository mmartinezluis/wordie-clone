import React from "react";

const examples = [
  ["S", "T", "A", "C", "K"],
  ["P", "H", "A", "S", "E"],
  ["G", "R", "A", "P", "E"],
  ["Q", "U", "O", "U", "E"],
  ["R", "-", "S", "-", "T"],
];

const assertion_matrix = [
  ["right", "", "", "", ""],
  ["", "close", "", "", ""],
  ["", "", "", "", "missed"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const Help = () => {
  return (
    <div className="help">
      <h2>How to Play</h2>
      <p>
        The goal of the game is to guess the five-characters word in at most 6
        attempts. After every attempt, each of the letters in the attempted row
        will be color-coded depending on whether the letter is not in the word
        at all (gray cells), it's in the word, but not in the correct position
        (yellow cells), or it's in the word and in the correct position (green
        cells). Examples:
      </p>
      <div className="board">
        <div className="row">
          {new Array(1).fill(0).map((r, ri) =>
            new Array(5).fill(0).map((c, ci) => {
              return (
                <div className={`cell ${assertion_matrix[0][ci]}`} key={ci}>
                  {examples[0][ci]}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="examples">
        <span>
          <strong>S</strong> is in the word and in the correct position
        </span>
      </div>
      <div className="board">
        <div className="row">
          {new Array(1).fill(0).map((r, ri) =>
            new Array(5).fill(0).map((c, ci) => {
              return (
                <div className={`cell ${assertion_matrix[1][ci]}`} key={ci}>
                  {examples[1][ci]}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="examples">
        <span>
          <strong>H</strong> is in the word, but in the wrong position
        </span>
      </div>
      <div className="board">
        <div className="row">
          {new Array(1).fill(0).map((r, ri) =>
            new Array(5).fill(0).map((c, ci) => {
              return (
                <div className={`cell ${assertion_matrix[2][ci]}`} key={ci}>
                  {examples[2][ci]}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="examples">
        <span>
          <strong>E</strong> is not in the word
        </span>
      </div>
      <br />

      <h3>Editing Cells</h3>
      <p>
        If you click on any nonempty cell within the current row, that cell
        becomes editable, and it will glow:
      </p>
      <div className="board">
        <div className="row">
          {new Array(1).fill(0).map((r, ri) =>
            new Array(5).fill(0).map((c, ci) => {
              return (
                <div className={`cell  ${ci === 2 ? "glow" : ""} `} key={ci}>
                  {examples[3][ci]}
                </div>
              );
            })
          )}
        </div>
      </div>
      <br />
      <br />

      <h3>Placeholders</h3>
      <p>
        Pressing the space key in your device or on the page's keyboard will
        insert a dash as a letter placeholder for the cell. Dashes will later
        need to be replaced for your word to be processed.
      </p>
      <div className="board">
        <div className="row">
          {new Array(1).fill(0).map((r, ri) =>
            new Array(5).fill(0).map((c, ci) => {
              return (
                <div className="cell" key={ci}>
                  {examples[4][ci]}
                </div>
              );
            })
          )}
        </div>
      </div>
      <br />
      <br />

      <h3>Re-Starting the Game</h3>
      <p>
        You can start a new game at any time by pressing the <em>New Game</em>{" "}
        button in the header section.
      </p>
      <p>
        Can you guess the words for PHASE, GRAPE, and QUOUE from the above
        examples? (Hint: they come from data structures and algorithms topics)
      </p>
      <p>Have fun with Wordie Clone!!!</p>
    </div>
  );
};

export default Help;
