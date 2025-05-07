import React, { useRef, useEffect, useState } from "react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

interface VideoFeedProps {
  videos: Video[];
  currentIndex: number;
  onVideoChange: (index: number) => void;
  onGameStart: () => void;
  activeTab: "forYou" | "following";
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  videos, 
  currentIndex, 
  onVideoChange, 
  onGameStart,
  activeTab,
}) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      
      // Prevent rapid scrolling
      if (now - lastScrollTime < 300) return;
      setLastScrollTime(now);

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
      
      // Reduced threshold for more sensitive touch response
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
  }, [currentIndex, videos.length, onVideoChange, lastScrollTime]);

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
    <div 
      ref={feedRef}
      className="fixed inset-0 h-screen w-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ 
        scrollBehavior: "smooth",
        scrollSnapType: "y mandatory",
        scrollSnapStop: "always"
      }}
    >
      {videos.map((video, index) => (
        <div 
          key={video.id} 
          className="h-screen w-screen snap-start"
          style={{ 
            scrollSnapAlign: "start",
            height: "100vh",
            width: "100vw"
          }}
        >
          <VideoCard
          video={video} 
          isActive={index === currentIndex}
          onGameStart={onGameStart}
        />
        </div>
      ))}
      {videos.length === 0 && (
        <div className="h-screen w-screen flex items-center justify-center text-gray-500" style={{ marginTop: "-20vh" }}>
          <p className="text-lg">
            No videos found for{" "}
            {activeTab === "forYou" ? "you" : "your following"}.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed; 
