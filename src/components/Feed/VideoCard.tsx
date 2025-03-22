import React, { useRef, useEffect, useState } from 'react';
import { FaHeart, FaComment, FaShare, FaGamepad } from 'react-icons/fa';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onGameStart: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, onGameStart }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, [isActive]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className={`video-card ${isActive ? 'active' : ''}`}>
      <div className="video-container" onClick={togglePlayPause}>
        <video 
          ref={videoRef}
          src={video.url}
          loop
          playsInline
          muted
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="video-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="video-info">
        <div className="user-info">
          <img 
            src={video.user.profilePic || '/default-profile.jpg'} 
            alt={video.user.username} 
            className="user-avatar"
          />
          <div className="username">{video.user.username}</div>
        </div>
        <div className="video-description">{video.description}</div>
        <div className="video-subject">
          {video.subject && <span className="subject-tag">{video.subject}</span>}
          {video.topic && <span className="topic-tag">{video.topic}</span>}
        </div>
      </div>
      
      <div className="video-actions">
        <button className="action-button">
          <FaHeart />
          <span>{formatCount(video.likes)}</span>
        </button>
        <button className="action-button">
          <FaComment />
          <span>{formatCount(video.comments)}</span>
        </button>
        <button className="action-button">
          <FaShare />
          <span>{formatCount(video.shares)}</span>
        </button>
        <button className="action-button" onClick={(e) => {
          e.stopPropagation();
          onGameStart();
        }}>
          <FaGamepad />
          <span>Play</span>
        </button>
      </div>
    </div>
  );
};

export default VideoCard; 