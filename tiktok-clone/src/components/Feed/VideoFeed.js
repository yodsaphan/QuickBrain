import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const VideoFeed = ({ videos, currentIndex, onVideoChange, onVideoComplete }) => {
  const feedRef = useRef(null);

  // Set up scroll snap and video change detection
  useEffect(() => {
    const feedElement = feedRef.current;
    
    if (!feedElement) return;
    
    const handleScroll = () => {
      const scrollPosition = feedElement.scrollTop;
      const containerHeight = feedElement.clientHeight;
      
      // Calculate which video should be visible based on scroll position
      const videoIndex = Math.round(scrollPosition / containerHeight);
      
      if (videoIndex !== currentIndex && videoIndex >= 0 && videoIndex < videos.length) {
        onVideoChange(videoIndex);
      }
    };
    
    // Add scroll event listener
    feedElement.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      feedElement.removeEventListener('scroll', handleScroll);
    };
  }, [videos, currentIndex, onVideoChange]);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    const touchStartY = e.touches[0].clientY;
    feedRef.current.dataset.touchStartY = touchStartY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchStartY = parseInt(feedRef.current.dataset.touchStartY || 0);
    const swipeDistance = touchStartY - touchEndY;
    
    // Determine swipe direction and change video
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && currentIndex < videos.length - 1) {
        // Swipe up - go to next video
        onVideoChange(currentIndex + 1);
        feedRef.current.scrollTo({
          top: (currentIndex + 1) * feedRef.current.clientHeight,
          behavior: 'smooth'
        });
      } else if (swipeDistance < 0 && currentIndex > 0) {
        // Swipe down - go to previous video
        onVideoChange(currentIndex - 1);
        feedRef.current.scrollTo({
          top: (currentIndex - 1) * feedRef.current.clientHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div 
      className="content" 
      ref={feedRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          className="video-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <VideoPlayer 
            video={video} 
            isActive={index === currentIndex}
            onVideoComplete={onVideoComplete}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default VideoFeed; 