import React, { useState } from 'react';
import { FaUser, FaLock, FaTimes, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

const Login = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate and authenticate here
    onLogin({ username });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="auth-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2 className="auth-title">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <FaUser className="auth-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <FaLock className="auth-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-separator">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button className="social-button google">
            <FaGoogle /> Continue with Google
          </button>
          <button className="social-button facebook">
            <FaFacebook /> Continue with Facebook
          </button>
          <button className="social-button apple">
            <FaApple /> Continue with Apple
          </button>
        </div>
        
        <p className="auth-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={toggleMode}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login; 