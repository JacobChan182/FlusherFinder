import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styling/Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        display_name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    display_name: formData.display_name
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
                
                // Redirect to login page after successful signup
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Signup failed. Please try again.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Network error. Please check if the API is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h1>Welcome to FlushFinder</h1>
                <p className="login-subtitle">Sign up to access all features of the FlushFinder app</p>
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="display_name">Display Name</label>
                        <input
                            type="text"
                            id="display_name"
                            name="display_name"
                            value={formData.display_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
