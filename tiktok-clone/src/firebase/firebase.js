import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your_firebase_api_key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "quickbrain-cc2af.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "quickbrain-cc2af",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "quickbrain-cc2af.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your_messaging_sender_id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your_app_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('Firebase initialized with project:', firebaseConfig.projectId);

export { auth, db, storage };
export default app; 