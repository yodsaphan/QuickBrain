# TikTok Clone

A modern TikTok clone built with React, Redux, and Framer Motion.

## Features

- Vertical scrolling video feed with smooth transitions
- Video playback controls (play/pause, mute/unmute)
- Like, comment, and share functionality
- User profiles
- For You and Following tabs
- Video transcription feature
- Swipe gestures for navigation
- Responsive design matching iPhone 15 Pro Max dimensions

## Tech Stack

- **React**: Frontend library for building the user interface
- **Redux Toolkit**: State management
- **Framer Motion**: Animations and transitions
- **React Icons**: Icon library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/tiktok-clone.git
cd tiktok-clone
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
tiktok-clone/
├── public/
│   ├── videos/         # Sample videos
│   └── profiles/       # Profile images
├── src/
│   ├── components/
│   │   ├── Feed/       # Video feed components
│   │   ├── Navigation/ # Header and bottom navigation
│   │   ├── Profile/    # User profile components
│   │   └── VideoPlayer/# Video player components
│   ├── store/          # Redux store and slices
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── README.md
```

## Future Enhancements

- Authentication system
- Video upload functionality
- Comments section
- Direct messaging
- Discover page
- Personalized For You page algorithm
- Effects and filters for video creation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by TikTok
- Built for educational purposes
