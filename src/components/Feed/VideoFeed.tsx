import React, { useRef, useEffect } from 'react';
import { Video } from '@/types';
import VideoCard from './VideoCard';

interface VideoFeedProps {
  videos: Video[];
  currentIndex: number;
  onVideoChange: (index: number) => void;
  onGameStart: () => void;
  activeTab: 'forYou' | 'following';
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  videos, 
  currentIndex, 
  onVideoChange, 
  onGameStart,
  activeTab
}) => {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const scrollPosition = feedRef.current.scrollTop;
      const videoHeight = feedRef.current.clientHeight;
      
      const newIndex = Math.round(scrollPosition / videoHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
        onVideoChange(newIndex);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (feedElement) {
        feedElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentIndex, videos.length, onVideoChange]);

  return (
    <div className="video-feed" ref={feedRef}>
      {videos.map((video, index) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          isActive={index === currentIndex}
          onGameStart={onGameStart}
        />
      ))}
      {videos.length === 0 && (
        <div className="empty-feed">
          <p>No videos found for {activeTab === 'forYou' ? 'you' : 'your following'}.</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed; 