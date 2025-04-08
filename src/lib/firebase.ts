import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration with fallback values for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123def456'
};

// Initialize Firebase only if API key is valid (not the demo value)
const isValidConfig = firebaseConfig.apiKey !== 'demo-api-key';
let app;
let auth;
let db;
let storage;
let analytics: Analytics | undefined;
let googleProvider;
let facebookProvider;
let appleProvider;

if (isValidConfig) {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize providers
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  appleProvider = new OAuthProvider('apple.com');
  
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
  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.error('Analytics check failed:', error);
    });
  }
} else {
  console.warn('Firebase is initialized with demo values. Set proper environment variables for production use.');
  
  // Create mock objects for development
  app = {} as any;
  auth = {} as any;
  db = {} as any;
  storage = {} as any;
  googleProvider = {} as any;
  facebookProvider = {} as any;
  appleProvider = {} as any;
}

export { 
  auth, 
  db, 
  storage, 
  googleProvider, 
  facebookProvider, 
  appleProvider,
  analytics,
  isValidConfig
};
export default app; 