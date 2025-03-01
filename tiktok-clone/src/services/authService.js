import api from './api';
import { 
  registerWithFirebase, 
  loginWithFirebase, 
  logoutFromFirebase, 
  getCurrentUserData,
  resetPassword
} from '../firebase/auth';
import { auth } from '../firebase/firebase';
import jwt from 'jsonwebtoken';

// Generate a token for the user (client-side only, for demo purposes)
// In a real app, this would be done on the server
const generateToken = (user) => {
  // This is just for demo purposes - in a real app, tokens should be generated server-side
  const token = jwt.sign(
    { 
      uid: user.uid, 
      email: user.email 
    }, 
    'your_jwt_secret_key_change_in_production', 
    { expiresIn: '7d' }
  );
  return token;
};

// Register a new user
export const register = async (userData) => {
  try {
    // Register with Firebase
    const firebaseUser = await registerWithFirebase(
      userData.email, 
      userData.password, 
      userData.username
    );
    
    // Get additional user data from Firestore
    const userDoc = await getCurrentUserData(firebaseUser.uid);
    
    // Generate token
    const token = generateToken(firebaseUser);
    
    // Create user object with token
    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      username: userData.username,
      profilePic: null,
      token: token,
      ...userDoc
    };
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    throw { message: error.message || 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // Login with Firebase
    const firebaseUser = await loginWithFirebase(
      credentials.email, 
      credentials.password
    );
    
    // Get additional user data from Firestore
    const userDoc = await getCurrentUserData(firebaseUser.uid);
    
    // Generate token
    const token = generateToken(firebaseUser);
    
    // Create user object with token
    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      username: userDoc.username,
      profilePic: userDoc.profilePictureUrl,
      token: token,
      ...userDoc
    };
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    throw { message: error.message || 'Login failed' };
  }
};

// Logout user
export const logout = async () => {
  try {
    await logoutFromFirebase();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    throw { message: error.message || 'Logout failed' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    // Check if user is logged in with Firebase
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      throw new Error('User not authenticated');
    }
    
    // Get additional user data from Firestore
    const userDoc = await getCurrentUserData(firebaseUser.uid);
    
    // Create user object
    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      username: userDoc.username,
      profilePic: userDoc.profilePictureUrl,
      ...userDoc
    };
    
    return { success: true, user };
  } catch (error) {
    throw { message: error.message || 'Failed to get current user' };
  }
};

// Reset password
export const resetUserPassword = async (email) => {
  try {
    await resetPassword(email);
    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    throw { message: error.message || 'Failed to send password reset email' };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const firebaseUser = auth.currentUser;
  return !!token && !!firebaseUser;
};

// Get user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}; 