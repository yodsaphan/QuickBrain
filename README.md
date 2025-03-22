# QuickBrain

QuickBrain is an educational short-form video platform designed to help users learn quickly through engaging content. Think of it as "TikTok for learning" - short, focused educational videos with interactive quizzes to reinforce learning.

## Features

- **Short Educational Videos**: Browse through a feed of short educational videos
- **Interactive Quizzes**: Test your knowledge with quizzes related to video content
- **AI Assistant**: Get help understanding concepts with an AI chat assistant
- **Learning Streaks**: Build a daily learning habit with streak tracking
- **User Profiles**: Track your learning progress and achievements

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: CSS with Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: Redux Toolkit

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: React components organized by feature
- `/src/lib`: Utility functions and configuration
- `/src/services`: API service functions
- `/src/types`: TypeScript type definitions
