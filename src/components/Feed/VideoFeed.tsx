import React, { useRef, useEffect, useState } from "react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";
import { FaRobot } from "react-icons/fa";

interface VideoFeedProps {
  videos: Video[];
  currentIndex: number;
  onVideoChange: (index: number) => void;
  onGameStart: () => void;
  onNavigateToLearn: (topic: string) => void;
  watchedVideos: string[];
  onGenerateNewSet: () => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  videos, 
  currentIndex, 
  onVideoChange, 
  onGameStart,
  onNavigateToLearn,
  watchedVideos,
  onGenerateNewSet,
}) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const allVideosWatched = videos.length > 0 && videos.every(video => watchedVideos.includes(video.id));

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(
        0,
        Math.min(videos.length - 1, currentIndex + direction)
      );

      if (newIndex !== currentIndex) {
        onVideoChange(newIndex);
        if (feedRef.current) {
          const targetScroll = newIndex * window.innerHeight;
          feedRef.current.scrollTo({
            top: targetScroll,
            behavior: "smooth"
          });
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!feedRef.current) return;
      
      const touchEnd = e.touches[0].clientY;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 30) {
        setIsScrolling(true);
        const direction = diff > 0 ? 1 : -1;
        const newIndex = Math.max(
          0,
          Math.min(videos.length - 1, currentIndex + direction)
        );
      
        if (newIndex !== currentIndex) {
          onVideoChange(newIndex);
          const targetScroll = newIndex * window.innerHeight;
          feedRef.current.scrollTo({
            top: targetScroll,
            behavior: "smooth"
          });
        }
      }
    };

    const handleTouchEnd = () => {
      setIsScrolling(false);
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("wheel", handleScroll, { passive: false });
      feedElement.addEventListener("touchstart", handleTouchStart);
      feedElement.addEventListener("touchmove", handleTouchMove);
      feedElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (feedElement) {
        feedElement.removeEventListener("wheel", handleScroll);
        feedElement.removeEventListener("touchstart", handleTouchStart);
        feedElement.removeEventListener("touchmove", handleTouchMove);
        feedElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentIndex, videos.length, onVideoChange]);

  // Ensure the current video is fully visible when the component mounts or updates
  useEffect(() => {
    if (feedRef.current) {
      const targetScroll = currentIndex * window.innerHeight;
      feedRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <div 
        ref={feedRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory"
        style={{
          scrollSnapType: "y mandatory",
          scrollSnapStop: "always",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-screen snap-start snap-always"
            ref={index === currentIndex ? feedRef : null}
          >
            <VideoCard
              video={video}
              onGameStart={onGameStart}
              onNavigateToLearn={onNavigateToLearn}
            />
          </div>
        ))}
        {videos.length === 0 && (
          <div className="h-screen w-screen flex items-center justify-center text-gray-500">
            <p className="text-lg">No videos available.</p>
          </div>
        )}
        {allVideosWatched && (
          <div className="h-screen w-screen flex items-center justify-center">
            <button
              onClick={onGenerateNewSet}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg"
            >
              <FaRobot className="text-xl" />
              <span className="text-lg">Generate New Set</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoFeed; 
