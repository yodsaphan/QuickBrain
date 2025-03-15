import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToAI } from '../../services/aiService';

const AIChat = ({ onClose, videoContent = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Add initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: "Hi there! I'm your AI learning assistant. Ask me anything about the video or any educational topic!",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Send message to OpenAI
      const aiResponse = await sendMessageToAI(
        inputMessage, 
        messages.map(msg => ({ text: msg.text, sender: msg.sender }))
      );
      
      // Add AI response to messages
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now(),
          text: error.message || "Sorry, I couldn't process your request. Please try again.",
          sender: 'ai',
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="ai-chat-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <FaRobot className="ai-icon" />
          <h3>AI Learning Assistant</h3>
        </div>
        <button className="ai-chat-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="ai-chat-messages">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div 
              key={message.id}
              className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            className="ai-typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaSpinner className="spinner" />
            <span>AI is thinking...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="ai-chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !inputMessage.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </motion.div>
  );
};

export default AIChat; 