import React from 'react';
import whiteLogo from './assets/logo_white.png';
import helpIcon from './assets/help.png';

function Header({ onNavItemClick, selectedNavItem }) {
    return (
        <header>
            <nav className="navbar"> 
                <img className="logo-small" src={whiteLogo} alt="Logo" />
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <a className={`nav-link ${selectedNavItem === 'todaysGame' ? 'active' : ''}`} data-toggle="pill" href="#" onClick={() => onNavItemClick('todaysGame')}>Today's Game</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${selectedNavItem === 'archive' ? 'active' : ''}`} data-toggle="pill" href="#" onClick={() => onNavItemClick('archive')}>Archive</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${selectedNavItem === 'stats' ? 'active' : ''}`} data-toggle="pill" href="#" onClick={() => onNavItemClick('stats')}>Stats</a>
                    </li>
                </ul> 

                <div className="info-icon-container">
                    <img className="info-icon" src={helpIcon} alt="Info" />
                    <div className="tooltip">
                        <p>How the game works:</p>
                        
                        <p>Every day, a new secret movie awaits! Your goal is to guess the movie using the provided clues from your guesses. 
                        Use the hints to refine your guesses and aim to solve it in as few tries as possible. Need extra help? Hover over an actor's name to see their photo.
                        </p>
                        <p>Good luck and have fun!</p>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;