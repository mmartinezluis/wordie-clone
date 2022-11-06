import React, { useCallback } from 'react';
import './App.css';
import Board, { reinitialzeGame } from './components/Board';
import Modal from 'react-modal';
// import logo from './logo.svg';

const modalCustomStyles = {
  content: {
    inset: 'unset',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '16px',
    color: 'rgb(51, 51, 51)',
    overflow: 'unset',
    // width: '100%',
    position: 'absoulte'
  },
  overlay: {
    backgroundColor: 'transparent',
    maxWidth: '300px',
    minWidth: '200px',
    height: '4%',
    translate: '-50% 0%',
    zIndex: '100',
    inset: '5% 0% 0% 50%',
    position: 'fixed'
  }
};

export const modalCodes ={
  won: "#2196f3",
  missed: "rgb(244, 63, 94)",
  lost: "#9c27b0"
}

Modal.setAppElement('#root');

function App() {

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalStatus, setModalStatus] = React.useState(modalCodes.missed);
  const [modalText, setModalText] = React.useState("")

  const openModal = useCallback((text, time=3000) => {
    setModalText(text);
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setModalText("");
    }, time)
  },[])

  // const newGame = (callback) => callback();

  return (
    <div className="App">
      <Modal
          isOpen={modalIsOpen}
          style={Object.assign(modalCustomStyles, modalCustomStyles.content["backgroundColor"]= modalStatus )}
          contentLabel="Example Modal"
          shouldCloseOnEsc={false}
          shouldCloseOnOverlayClick={false}
          shouldFocusAfterRender={false}
          shouldReturnFocusAfterClose={true}
          overlayClassName={"ReactModal__Overlay2 " + modalIsOpen ? "fade-in-modal" : "fade-out-modal"}
      >        
        <div style={{textAlign: 'center', lineHeight: '1.4', color: 'white', fontWeight: '500'}}>       
            {modalText}
        </div>      
      </Modal>
      <header className="App-header">
        <div className='header--filler'></div>
        <div className='header--title'>
          <h2>Wordle Clone</h2>
        </div>
        <div className='header--new_game'>
          <button onClick={() => reinitialzeGame()}>New Game</button>
        </div>
      </header>
      <Board 
        openModal={openModal} 
        setIsOpen={setIsOpen}
        setModalStatus={setModalStatus}
        setModalText={setModalText}
        // newGame={newGame}
      />
    </div>
  );
}

export default App;







