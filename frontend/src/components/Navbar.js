import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCookie } from '../utils/cookies';
import '../styling/Navbar.css';
import FlushFinderTextLogo from './logos/FlushFinderTextLogo-2.png';

const Navbar = () => {
    const { isAuthenticated, logout, getToken } = useAuth();
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        console.log('Navbar - isAuthenticated:', isAuthenticated);
        console.log('Navbar - token:', getToken());
        
        const fetchUserData = async () => {
            if (isAuthenticated && getToken()) {
                // First check if display name is in cookie (stored during login)
                const cookieDisplayName = getCookie('user_display_name');
                console.log('Navbar - Cookie display name:', cookieDisplayName);
                
                if (cookieDisplayName) {
                    setDisplayName(cookieDisplayName);
                    return;
                }

                // If not in cookie, fetch from API
                try {
                    const response = await fetch('http://localhost:8000/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${getToken()}`
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        console.log('Navbar - User data:', userData);
                        setDisplayName(userData.display_name || userData.email);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, getToken]);

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
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <span className="navbar-user">👤 {displayName || 'User'}</span>
                            </li>
                            <li className="navbar-item">
                                <button onClick={logout} className="navbar-link logout-btn">Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">Login</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;