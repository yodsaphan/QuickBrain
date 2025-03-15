import api from './api';
import { 
  registerWithFirebase, 
  loginWithFirebase, 
  logoutFromFirebase, 
  getCurrentUserData
} from '../firebase/auth';
import { auth } from '../firebase/firebase';
import jwt from 'jsonwebtoken';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  googleProvider, 
  facebookProvider, 
  appleProvider 
} from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Reset password (legacy function)
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
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

// Helper function to create user profile in Firestore
const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  // If user doesn't exist in Firestore, create a new document
  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        streakCount: 0,
        watchedVideos: [],
        gameScores: [],
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }

  return userRef;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Facebook', error);
    throw error;
  }
};

// Sign in with Apple
export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Apple', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Error signing up with email', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

// Reset password (new function)
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password', error);
    throw error;
  }
}; 