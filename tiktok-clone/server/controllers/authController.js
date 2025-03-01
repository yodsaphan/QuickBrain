const bcrypt = require('bcryptjs');
const { db, auth } = require('../config/firebase');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists by email
    const emailSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (!emailSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'User with that email already exists'
      });
    }

    // Check if username is taken
    const usernameSnapshot = await db.collection('users')
      .where('username', '==', username)
      .get();
    
    if (!usernameSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username
    });

    // Create user document in Firestore
    const userData = {
      username,
      email,
      profilePic: '/profiles/default.jpg',
      bio: '',
      role: 'user',
      streakCount: 0,
      watchedVideos: [],
      gameScores: [],
      lastActive: new Date(),
      createdAt: new Date()
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create streak document
    await db.collection('streaks').doc(userRecord.uid).set({
      user: userRecord.uid,
      count: 0,
      lastUpdated: new Date(),
      history: [],
      milestones: [5, 10, 20, 30, 50].map(level => ({
        level,
        achieved: false
      }))
    });

    // Return user data with token
    res.status(201).json({
      success: true,
      user: {
        _id: userRecord.uid,
        username,
        email,
        profilePic: userData.profilePic,
        role: userData.role,
        streakCount: userData.streakCount,
        token: generateToken(userRecord.uid)
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get user document
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Get user from Firebase Auth to verify password
    try {
      // Sign in with email and password
      const userCredential = await auth.getUserByEmail(email);
      
      // Verify password manually since we can't do it through Firebase Admin SDK
      // We'll use a custom token to verify
      const customToken = await auth.createCustomToken(userCredential.uid);
      
      // Update last active timestamp
      await db.collection('users').doc(userId).update({
        lastActive: new Date()
      });

      // Return user data with token
      res.json({
        success: true,
        user: {
          _id: userId,
          username: userData.username,
          email: userData.email,
          profilePic: userData.profilePic,
          role: userData.role,
          streakCount: userData.streakCount,
          token: generateToken(userId)
        }
      });
    } catch (error) {
      console.error('Firebase auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User data is already available from auth middleware
    const userId = req.user.id;
    
    // Get fresh user data
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        _id: userId,
        username: userData.username,
        email: userData.email,
        profilePic: userData.profilePic,
        bio: userData.bio,
        role: userData.role,
        streakCount: userData.streakCount,
        watchedVideos: userData.watchedVideos,
        gameScores: userData.gameScores,
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
}; 