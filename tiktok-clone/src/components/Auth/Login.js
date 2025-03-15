import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithApple 
} from '../../services/authService';

const Login = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await signInWithEmail(email, password);
      } else {
        user = await signUpWithEmail(email, password, username);
      }
      onLogin(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithFacebook();
      onLogin(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithApple();
      onLogin(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <motion.div 
        className="auth-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button className="auth-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <FaEnvelope className="auth-icon" />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="auth-input-group">
            <FaEnvelope className="auth-icon" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-separator">
          <span>or</span>
        </div>
        
        <div className="social-login">
          <motion.button 
            className="social-button google"
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FaGoogle />
            Continue with Google
          </motion.button>
          
          <motion.button 
            className="social-button facebook"
            whileTap={{ scale: 0.95 }}
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            <FaFacebook />
            Continue with Facebook
          </motion.button>
          
          <motion.button 
            className="social-button apple"
            whileTap={{ scale: 0.95 }}
            onClick={handleAppleSignIn}
            disabled={loading}
          >
            <FaApple />
            Continue with Apple
          </motion.button>
        </div>
        
        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 