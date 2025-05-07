import React, { useRef, useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaGamepad,
  FaPlay,
  FaPause,
  FaMusic,
  FaUpload,
  FaRobot,
} from "react-icons/fa";
import { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onGameStart: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  onGameStart,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && hasUserInteracted) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing video:", error);
            setIsPlaying(false);
        });
        }
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, [isActive, hasUserInteracted]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      setHasUserInteracted(true);
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing video:", error);
            setIsPlaying(false);
        });
        }
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
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
    <div className="relative h-screen bg-black">
      <div className="absolute inset-0" onClick={togglePlayPause}>
        <video 
          ref={videoRef}
          src={video.url}
          loop
          playsInline
          muted
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <FaPlay className="w-16 h-16 text-white/80" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <FaHeart className="w-6 h-6" />
          </button>
          <span className="text-white text-sm mt-1">
            {formatCount(video.likes)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <FaComment className="w-6 h-6" />
          </button>
          <span className="text-white text-sm mt-1">
            {formatCount(video.comments)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <FaShare className="w-6 h-6" />
          </button>
          <span className="text-white text-sm mt-1">
            {formatCount(video.shares)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={(e) => {
              e.stopPropagation();
              onGameStart();
            }}
          >
            <FaGamepad className="w-6 h-6" />
          </button>
          <span className="text-white text-sm mt-1">Play</span>
        </div>
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <FaUpload className="w-6 h-6" />
          </button>
          <span className="text-white text-sm mt-1">Upload</span>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="absolute bottom-24 left-4 right-20">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={video.user.profilePic || "/default-profile.jpg"}
            alt={video.user.username}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="text-white font-semibold">
            @{video.user.username}
          </span>
        </div>
        <p className="text-white text-sm mb-2">{video.description}</p>
        <div className="flex items-center gap-2">
          <FaMusic className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Original Sound</span>
          <button className="ml-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <FaRobot className="w-4 h-4" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard; 
