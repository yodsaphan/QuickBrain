"use client";

import { useState, useEffect, useMemo } from "react";
import { FaBook } from "react-icons/fa";
import { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  onGameStart: () => void;
  onNavigateToLearn: (topic: string) => void;
}

export default function VideoCard({ video, onGameStart, onNavigateToLearn }: VideoCardProps) {
  const pastelColor = useMemo(() => {
    // Generate a deterministic hue based on the video ID
    const hash = video.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 90%)`;
  }, [video.id]);

  return (
    <div 
      className="relative h-screen w-screen"
      style={{ backgroundColor: pastelColor }}
    >
      <div className="absolute top-4 left-4 right-4 z-20">
        <h2 className="text-2xl font-bold text-gray-800">{video.title}</h2>
        <p className="text-gray-600 mt-1">{video.topic}</p>
      </div>
      <div className="absolute bottom-20 right-4 z-20">
        <button
          onClick={() => onNavigateToLearn(video.topic || video.title)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors shadow-lg"
        >
          <FaBook className="text-xl" />
          <span className="text-lg">Start Learning</span>
        </button>
      </div>
    </div>
  );
} 
