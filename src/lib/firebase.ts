import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration with fallback values for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase configuration is valid
const isValidConfig = Object.values(firebaseConfig).every(value => value !== undefined && value !== '');

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
  
  // Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
  
  // Configure providers
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  facebookProvider.setCustomParameters({
    'display': 'popup'
  });
  
  appleProvider.addScope('email');
  appleProvider.addScope('name');
  
  // Only initialize analytics on client side
let analytics: Analytics | undefined;
  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.error('Analytics check failed:', error);
    });
}

export { 
  app, 
  db, 
  auth, 
  storage, 
  googleProvider, 
  facebookProvider, 
  appleProvider,
  analytics,
  isValidConfig
};