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
                <button
                    aria-label="Close portal"
                    aria-labelledby="close-portal"
                    className="_portal-close"
                    onClick={closePortal}
                >
                    <span id="close-portal" className="_hide-visual">
                        Close
                    </span>
                    {/* <svg className="_portal-close-icon" viewBox="0 0 40 40">
                        <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                    </svg> */}
                    <img src={closeIcon} className="_portal-close-icon" alt="close icon" />
                </button>
                <div className="portal-body">
                    <div style={{textAlign: 'center', lineHeight: '1.4',}}>
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
