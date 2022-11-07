import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const PortalContainer = ({ children }) => {

    const [isShown, setIsShown] = useState(false);

    const showPortal = () => {
        setIsShown(true) 
        toggleScrollLock();
    };

    const closePortal = () => {
        setIsShown(false);
        toggleScrollLock();
    };

    const onKeyDown = (event) => {
        if (event.keyCode === 27) {
            closePortal();
        }
    };

    const onClickOutside = (event) => {
        if(event.target.tagName !== "ASIDE") return
        closePortal();
    };

    const toggleScrollLock = () => {
        document.querySelector('html').classList.toggle('scroll-lock');
    };

    const myRef = useRef(null);
    useEffect(() => {
        myRef.current.focus();
    },[])

    return ReactDOM.createPortal(
        <aside
            tag="aside"
            role="dialog"
            tabIndex="-1"
            aria-modal="true"
            className="portal-cover"
            onClick={onClickOutside}
            onKeyDown={onKeyDown}
            ref={myRef}
        >
            <div className="portal-area" >
                <button
                    aria-label="Close portal"
                    aria-labelledby="close-portal"
                    className="_portal-close"
                    onClick={closePortal}
                >
                    <span id="close-portal" className="_hide-visual">
                        Close
                    </span>
                    <svg className="_portal-close-icon" viewBox="0 0 40 40">
                        <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                    </svg>
                </button>
                <div className="portal-body">
                    { children }
                </div>
            </div>
        </aside>,
        document.querySelector('#root')
    );
}

export default PortalContainer;
