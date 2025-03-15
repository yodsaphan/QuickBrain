import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgaMC-dqBqYlfk-vqEeHVFCaqBwAxCEsg",
  authDomain: "quickbrain-a8cbb.firebaseapp.com",
  projectId: "quickbrain-a8cbb",
  storageBucket: "quickbrain-a8cbb.firebasestorage.app",
  messagingSenderId: "424685001340",
  appId: "1:424685001340:web:5a723c89ea7b5d8f1747f9",
  measurementId: "G-XV3X3XXQXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
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

console.log('Firebase initialized with project:', firebaseConfig.projectId);

export { 
  auth, 
  db, 
  storage, 
  googleProvider, 
  facebookProvider, 
  appleProvider,
  analytics
};
export default app; 