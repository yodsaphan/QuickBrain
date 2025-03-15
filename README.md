# QuickBrain

QuickBrain is an innovative educational platform that delivers bite-sized learning content through short-form videos, similar to TikTok but focused on education.

## Features

- **Short Educational Videos**: Learn complex topics in 60 seconds or less
- **AI Learning Assistant**: Chat with an AI to get help understanding concepts
- **Social Learning**: Follow educational creators and share content
- **Gamification**: Earn streaks and rewards for consistent learning
- **Flashcard Quizzes**: Test your knowledge with interactive quizzes
- **Multiple Subject Areas**: Content across Mathematics, Science, History, and more
- **Social Login**: Sign in with Google, Facebook, or Apple

## Tech Stack

- **Frontend**: React, Redux Toolkit, Framer Motion
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: OpenAI API
- **Storage**: Firebase Storage
- **Analytics**: Firebase Analytics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key (for AI chat functionality)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/quickbrain.git
cd quickbrain
```

2. Install dependencies for the client:
```
npm install
```

3. Install dependencies for the server:
```
cd server
npm install
```

4. Create a `.env` file in the root directory with your Firebase and OpenAI credentials:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

5. Create a `.env` file in the server directory:
```
PORT=5000
JWT_SECRET=your_jwt_secret
```

6. Start the development server:
```
# In the root directory
npm start

# In a separate terminal, start the backend
cd server
npm run dev
```

## Project Structure

```
quickbrain/
├── public/
│   ├── videos/         # Sample videos
│   └── profiles/       # Profile images
├── server/
│   ├── config/         # Server configuration
│   ├── controllers/    # API controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   └── server.js       # Server entry point
├── src/
│   ├── components/
│   │   ├── AI/         # AI chat components
│   │   ├── Auth/       # Authentication components
│   │   ├── Feed/       # Video feed components
│   │   ├── Games/      # Educational games
│   │   ├── Navigation/ # Navigation components
│   │   ├── Profile/    # User profile components
│   │   ├── Streaks/    # Learning streak components
│   │   └── VideoPlayer/# Video player components
│   ├── firebase/       # Firebase configuration
│   ├── services/       # API and service functions
│   ├── store/          # Redux store
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── README.md
```

## Features in Development

- Personalized learning paths
- Content creator tools
- Advanced analytics for learning progress
- Collaborative learning spaces
- Mobile app versions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by TikTok's engaging short-form content format
- Built to make learning more accessible and engaging 