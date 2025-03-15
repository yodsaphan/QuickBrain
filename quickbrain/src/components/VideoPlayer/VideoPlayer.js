import React, { useRef, useEffect, useState } from 'react';
import { FaHeart, FaCommentDots, FaShare, FaMusic, FaVolumeUp, FaVolumeMute, FaChevronUp, FaGraduationCap, FaBrain, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VideoPlayer = ({ video, isActive, onVideoComplete, onAIChat }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTeacherChat, setShowTeacherChat] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Control video playback based on active state
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    if (isActive) {
      videoElement.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
      setProgress(0);
    }
  }, [isActive, video]);

  // Track video progress
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement || !isActive) return;
    
    const handleTimeUpdate = () => {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(progress);
      
      // Mark video as completed when watched 90% or more
      if (progress >= 90 && !videoCompleted) {
        setVideoCompleted(true);
        onVideoComplete && onVideoComplete(video.id);
      }
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isActive, video, videoCompleted, onVideoComplete]);

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowTeacherChat(false);
    setShowAiSummary(false);
    setShowAiChat(false);
  };

  // Toggle teacher chat
  const toggleTeacherChat = () => {
    closeAllModals();
    setShowTeacherChat(!showTeacherChat);
  };

  // Toggle AI summary
  const toggleAiSummary = () => {
    closeAllModals();
    setShowAiSummary(!showAiSummary);
  };

  // Toggle AI chat
  const toggleAiChat = () => {
    closeAllModals();
    setShowAiChat(!showAiChat);
  };

  return (
    <>
      {/* Video Player */}
      <video
        ref={videoRef}
        className="video-player"
        src={video.url || "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-her-hair-in-a-pool-1229-large.mp4"} // Fallback video
        loop
        muted={isMuted}
        playsInline
      />
      
      {/* Progress Bar */}
      <div className="video-progress-container">
        <div 
          className="video-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Swipe Indicator (only on first video) */}
      {video.id === 1 && (
        <div className="swipe-indicator">
          <FaChevronUp />
          <span className="swipe-text">Swipe up</span>
        </div>
      )}
      
      {/* Video Controls */}
      <div className="video-controls" onClick={toggleMute}>
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        <button 
          className="video-control-button ai-button"
          onClick={() => onAIChat(video)}
          title="Ask AI about this video"
        >
          <FaRobot />
        </button>
      </div>
      
      {/* Video Actions */}
      <div className="video-actions">
        <div className="profile-pic" style={{ backgroundImage: `url(${video.user.profilePic})` }} />
        
        <motion.div 
          className="action-icon"
          whileTap={{ scale: 1.2 }}
          onClick={toggleTeacherChat}
        >
          <FaGraduationCap />
          <span className="action-label">Teacher</span>
        </motion.div>
        
        <motion.div 
          className="action-icon"
          whileTap={{ scale: 1.2 }}
          onClick={toggleAiSummary}
        >
          <FaRobot />
          <span className="action-label">Ask AI</span>
        </motion.div>
        
        <motion.div 
          className="action-icon"
          whileTap={{ scale: 1.2 }}
          onClick={toggleAiChat}
        >
          <FaBrain />
          <span className="action-label">AI Chat</span>
        </motion.div>
      </div>
      
      {/* Video Info */}
      <div className="video-info">
        <div className="username">{video.user.username}</div>
        <div className="video-description">
          {video.description.split(' ').map((word, index) => 
            word.startsWith('#') ? 
              <span key={index} className="hashtag">{word} </span> : 
              <span key={index}>{word} </span>
          )}
        </div>
        <div className="video-tags">
          <span className="video-tag primary">{video.subject}</span>
          <span className="video-tag secondary">{video.topic}</span>
          <span className="video-tag duration">{video.duration}</span>
        </div>
      </div>

      {/* Teacher Chat Modal */}
      {showTeacherChat && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chat with {video.user.username}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="chat-messages">
                <div className="chat-message teacher">
                  <div className="chat-avatar" style={{ backgroundImage: `url(${video.user.profilePic})` }}></div>
                  <div className="chat-bubble">
                    <p>Hi there! I'm the creator of this video. Do you have any questions about {video.topic}?</p>
                    <span className="chat-time">Just now</span>
                  </div>
                </div>
              </div>
              <div className="chat-input-container">
                <input type="text" placeholder="Type your question..." className="chat-input" />
                <button className="chat-send">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showAiSummary && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>AI Video Summary</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="ai-summary">
                <div className="ai-icon">
                  <FaRobot />
                </div>
                <div className="ai-content">
                  {video.subject === 'Mathematics' && (
                    <p>This video explains how to solve quadratic equations using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. The instructor demonstrates the step-by-step process with examples, showing how to identify the values of a, b, and c, calculate the discriminant, and find the solutions.</p>
                  )}
                  {video.subject === 'Science' && (
                    <p>This video explains the water cycle, showing how water moves through Earth's systems. It covers evaporation (water turning into vapor), condensation (vapor forming clouds), precipitation (rain/snow falling), and collection (water gathering in oceans, lakes, and groundwater). The sun's energy drives this continuous cycle.</p>
                  )}
                  {video.subject === 'History' && (
                    <p>This video presents key facts about Ancient Egypt, including information about the pyramids, pharaohs, hieroglyphics, and the importance of the Nile River. It explains how this civilization developed around 3100 BCE and lasted for nearly 3,000 years, creating remarkable achievements in architecture, art, and writing.</p>
                  )}
                  {video.subject === 'English' && (
                    <p>This video offers three essential tips for improving essay writing: 1) Create a clear thesis statement to guide your writing, 2) Use topic sentences to begin each paragraph and support your main argument, and 3) Revise thoroughly for clarity, coherence, and correctness.</p>
                  )}
                </div>
              </div>
              <div className="ai-prompt-container">
                <input type="text" placeholder="Ask a question about this video..." className="ai-prompt-input" />
                <button className="ai-prompt-send">Ask</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAiChat && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>AI Learning Assistant</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="chat-messages">
                <div className="chat-message ai">
                  <div className="chat-avatar ai-avatar">
                    <FaBrain />
                  </div>
                  <div className="chat-bubble">
                    <p>Hello! I'm your AI learning assistant. I can help you understand concepts from the video or answer related questions about {video.subject}. What would you like to know?</p>
                    <span className="chat-time">Just now</span>
                  </div>
                </div>
              </div>
              <div className="chat-input-container">
                <input type="text" placeholder="Ask anything about this topic..." className="chat-input" />
                <button className="chat-send">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer; 