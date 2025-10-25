import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Navbar.css';
import FlushFinderTextLogo from './logos/FlushFinderTextLogo-2.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/"><img src={FlushFinderTextLogo} alt="FlushFinder" /></Link>
                </div>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/about" className="navbar-link">About</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/main" className="navbar-link">Find Restrooms</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/login" className="navbar-link">Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;