import React, { useRef, useEffect, useState } from 'react';
import { FaHeart, FaCommentDots, FaShare, FaMusic, FaVolumeUp, FaVolumeMute, FaChevronUp, FaGraduationCap, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VideoPlayer = ({ video, isActive, onVideoComplete }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTeacherChat, setShowTeacherChat] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // ... existing code

  return (
    <>
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-gray-900 relative z-1"
        src={video.url || "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-her-hair-in-a-pool-1229-large.mp4"}
        loop
        muted={isMuted}
        playsInline
      />
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
        <div 
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Swipe Indicator (only on first video) */}
      {video.id === 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 animate-bounce">
          <FaChevronUp className="mb-1" />
          <span className="text-xs">Swipe up</span>
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className="absolute bottom-20 left-4 bg-black/30 rounded-full p-2 cursor-pointer"
        onClick={toggleMute}
      >
        {isMuted ? <FaVolumeMute className="text-white text-xl" /> : <FaVolumeUp className="text-white text-xl" />}
      </div>
      
      {/* Video Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-5 bg-black/10 p-4 py-6 rounded-full backdrop-blur-sm">
        <div 
          className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white" 
          style={{ backgroundImage: `url(${video.user.profilePic})` }}
        />
        
        <motion.div 
          className="flex flex-col items-center gap-1 transition-transform duration-200 cursor-pointer"
          whileTap={{ scale: 1.2 }}
          onClick={toggleTeacherChat}
        >
          <FaGraduationCap className="text-2xl text-white filter drop-shadow-md" />
          <span className="text-xs text-white">Teacher</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-1 transition-transform duration-200 cursor-pointer"
          whileTap={{ scale: 1.2 }}
          onClick={toggleAiSummary}
        >
          <FaBrain className="text-2xl text-white filter drop-shadow-md" />
          <span className="text-xs text-white">AI Summary</span>
        </motion.div>
      </div>
      
      {/* Video Info */}
      <div className="absolute bottom-24 left-4 right-20 z-5">
        <div className="text-white font-medium mb-1">{video.user.username}</div>
        <div className="text-white/90 text-sm mb-2">
          {video.description.split(' ').map((word, index) => 
            word.startsWith('#') ? 
              <span key={index} className="text-primary">{word} </span> : 
              <span key={index}>{word} </span>
          )}
        </div>
        <div className="flex gap-2">
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{video.subject}</span>
          <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{video.topic}</span>
          <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{video.duration}</span>
        </div>
      </div>

      {/* ... modal components with Tailwind classes */}
    </>
  );
};

export default VideoPlayer; 