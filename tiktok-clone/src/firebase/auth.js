import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Register a new user with Firebase
export const registerWithFirebase = async (email, password, username) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      profilePictureUrl: null,
      bio: '',
      role: 'user',
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
    
    // Create streak document
    await setDoc(doc(db, 'streaks', user.uid), {
      userId: user.uid,
      currentStreak: 0,
      longestStreak: 0,
      lastActive: null,
      history: []
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Login with Firebase
export const loginWithFirebase = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last active timestamp
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastActive: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout from Firebase
export const logoutFromFirebase = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
}; 