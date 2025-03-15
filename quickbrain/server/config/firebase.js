const admin = require('firebase-admin');
const path = require('path');

try {
  // Path to service account file
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  console.log('Service account path:', serviceAccountPath);
  
  // Load service account
  const serviceAccount = require('./serviceAccountKey.json');
  console.log('Service account loaded successfully');
  
  // Initialize Firebase Admin with service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'quickbrain-cc2af.appspot.com'
  });
  
  console.log('Firebase Admin initialized with service account file');
  
  // Export Firebase services
  const db = admin.firestore();
  const auth = admin.auth();
  const storage = admin.storage();
  
  module.exports = {
    db,
    auth,
    storage,
    admin
  };
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Export empty objects to prevent crashes when importing
  module.exports = {
    db: {},
    auth: {},
    storage: {},
    admin
  };
} 