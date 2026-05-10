import React, { useState } from 'react';
import { FaGoogle, FaFacebook, FaApple, FaTimes } from 'react-icons/fa';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, appleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: any) => void;
  onClose: () => void;
  onCreateTestUser?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose, onCreateTestUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    }
  };

  const handleSocialLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with social provider');
    }
  };

  return (
    <div className="login-modal">
      <div className="login-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="submit-button">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div className="social-login">
          <p className="text-center">Or continue with</p>
          
          <div className="social-buttons">
            <button 
              className="social-button google"
              onClick={() => handleSocialLogin(googleProvider)}
            >
              <FaGoogle />
            </button>
            
            <button 
              className="social-button facebook"
              onClick={() => handleSocialLogin(facebookProvider)}
            >
              <FaFacebook />
            </button>
            
            <button 
              className="social-button apple"
              onClick={() => handleSocialLogin(appleProvider)}
            >
              <FaApple />
            </button>
          </div>
        </div>
        
        {onCreateTestUser && (
          <div className="test-account">
            <p>Development Testing</p>
            <button 
              className="test-button"
              onClick={onCreateTestUser}
            >
              Create Test Account
            </button>
          </div>
        )}
        
        <div className="toggle-form">
          <p>
            {isSignUp 
              ? 'Already have an account?' 
              : 'Don\'t have an account?'
            }
            <button 
              className="toggle-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 