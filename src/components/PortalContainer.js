import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import closeIcon from '../close-svgrepo-com.svg';

const PortalContainer = ({ children, toggle }) => {

    const [isShown, setIsShown] = useState(false);

    const showPortal = useCallback(() => {
        setIsShown(true); 
        toggleScrollLock();
    },[])

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
        myRef.current && myRef.current.focus();
        if(toggle) showPortal();
    },[toggle, showPortal])

    if(!isShown) return null;
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
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button
                        aria-label="Close portal"
                        aria-labelledby="close-portal"
                        className="_portal-close"
                        onClick={closePortal}
                    >
                        <span id="close-portal" className="_hide-visual">
                            Close
                        </span>
                        <img src={closeIcon} className="_portal-close-icon" alt="close icon" />
                    </button>
                </div>
                <div className="portal-body">
                    <div style={{lineHeight: '1.4',}}>
                        <div style={{padding: '0 10px 20px'}}>
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </aside>,
        document.querySelector('#root')
    );
}

export default PortalContainer;
