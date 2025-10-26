import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setCookie } from '../utils/cookies';
import { API_BASE_URL } from '../config';
import '../styling/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                
                // Store the token in cookies with 1 day expiration
                setCookie('access_token', data.access_token, 1);
                setCookie('token_type', data.token_type, 1);
                console.log('Cookies set:', document.cookie);
                
                // Update authentication state
                console.log('Calling login() from AuthContext...');
                login(data.access_token, data.token_type);
                console.log('login() called successfully');
                
                // Fetch and store user info
                try {
                    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`
                        }
                    });
                    
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        console.log('User data:', userData);
                        if (userData.display_name) {
                            setCookie('user_display_name', userData.display_name, 1);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching user info:', err);
                }
                
                // Small delay to ensure state updates, then redirect
                setTimeout(() => {
                    navigate('/main');
                }, 100);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check if the API is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Sign in to access your FlushFinder account</p>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup" className="login-footer-link">Sign up</Link></p>
                    <Link to="/forgot-password" className="login-footer-link">Forgot your password?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
