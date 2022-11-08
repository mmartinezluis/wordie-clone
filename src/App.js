import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import Modal from 'react-modal';
import help_icon from './help-svgrepo-com.svg';
import PortalContainer from './components/PortalContainer';
import Help from './sections/Help';
import About from './sections/About';

const modalCustomStyles = {
  content: {
    inset: 'unset',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '16px',
    color: 'rgb(51, 51, 51)',
    overflow: 'unset',
    position: 'absoulte',
    whiteSpace: 'nowrap'
  },
  overlay: {
    backgroundColor: 'transparent',
    maxWidth: '400px',
    minWidth: '400px',
    height: '4%',
    translate: '-50% 80%',
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

let portal_content = {current: null};

Modal.setAppElement('#root');

function App() {

  // @TODO: move modal to a react context
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(modalCodes.missed);
  const [modalText, setModalText] = useState("");
  const [toggle, setToggle] = useState(false);

  const openModal = (text, time=3000) => {
    setModalText(text);
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setModalText("");
    }, time)
  }

  const clearModal = () => {
    setIsOpen(false);
    setModalStatus(modalCodes.missed);
    setModalText("");
  }

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
        <div className='header__filler'></div>
        <div className='header__title'>
          <h2>Wordle Clone</h2>
        </div>
        <div className='header__buttons'>
          <img 
            src={help_icon} 
            className="help_icon" 
            alt="help icon" 
            onClick={() => {
                portal_content.current = "help";
                setToggle({});  
            }}
          />
          <div className='new_game__fake'>
            {/* This is a dummy button; the true button is placed on top of this */}
            {/* button using CSS; the true button belongs to the Board component */}
            <button style={{visibility: 'hidden'}}>New Game</button>
          </div>
          <div 
            className='about_link'
            onClick={() => {
              portal_content.current = "about"
              setToggle({})
            }}
          >
            About
          </div>
        </div>
      </header>
      <Board 
        openModal={openModal} 
        setIsOpen={setIsOpen}
        setModalStatus={setModalStatus}
        setModalText={setModalText}
        clearModal={clearModal}
      />
      <PortalContainer toggle={toggle}>
          {portal_content.current === "help" 
            ? <Help /> 
            : <About />
          }
      </PortalContainer>
    </div>
  );
}

export default App;







