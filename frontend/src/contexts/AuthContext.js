import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, getTokenType, logout as clearCookies } from '../utils/cookies';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to check authentication status from cookies
    const checkAuth = () => {
        const token = getAuthToken();
        const authenticated = !!token;
        setIsAuthenticated(authenticated);
        console.log('AuthContext - checkAuth called, authenticated:', authenticated);
        return authenticated;
    };

    useEffect(() => {
        // Check if user is logged in by checking for auth token in cookies
        console.log('AuthContext - Initial mount, checking auth...');
        checkAuth();
        setLoading(false);
    }, []);

    const login = (token, tokenType) => {
        console.log('AuthContext - login() called');
        setIsAuthenticated(true);
        console.log('AuthContext - isAuthenticated set to true');
    };

    const logout = () => {
        clearCookies();
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const value = {
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
        getToken: getAuthToken,
        getTokenType: getTokenType
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
