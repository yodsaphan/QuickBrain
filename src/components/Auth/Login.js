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

  // ... existing functions

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div 
        className="bg-dark-300 rounded-xl w-[90%] max-w-md p-6 relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
          onClick={onClose}
        >
          <FaTimes className="text-xl" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-dark-100 border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:border-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-dark-100 border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-dark-100 border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>
        
        <div className="space-y-3">
          <motion.button 
            className="w-full flex items-center justify-center gap-2 border border-gray-700 bg-dark-100 hover:bg-dark-200 text-white py-3 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FaGoogle className="text-red-500" />
            <span>Continue with Google</span>
          </motion.button>
          
          <motion.button 
            className="w-full flex items-center justify-center gap-2 border border-gray-700 bg-dark-100 hover:bg-dark-200 text-white py-3 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            <FaFacebook className="text-blue-600" />
            <span>Continue with Facebook</span>
          </motion.button>
          
          <motion.button 
            className="w-full flex items-center justify-center gap-2 border border-gray-700 bg-dark-100 hover:bg-dark-200 text-white py-3 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={handleAppleSignIn}
            disabled={loading}
          >
            <FaApple className="text-white" />
            <span>Continue with Apple</span>
          </motion.button>
        </div>
        
        <div className="mt-6 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button" 
            className="ml-1 text-primary hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 