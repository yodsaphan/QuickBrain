import React, { useState, useRef } from 'react';
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { isValidConfig } from '@/lib/firebase';

interface VideoUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }
    
    // Check file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file is too large (max 100MB)');
      return;
    }
    
    setVideoFile(file);
    setError('');
    
    // Create video preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for thumbnail');
      return;
    }
    
    setThumbnailFile(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidConfig) {
      setError('Firebase is not properly configured. Video upload is disabled.');
      return;
    }
    
    if (!videoFile) {
      setError('Please select a video to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      // In a real app, you would upload the video to Firebase Storage
      // and create a document in Firestore
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to upload video');
      setUploading(false);
    }
  };
  
  return (
    <div className="upload-modal">
      <div className="upload-header">
        <h3>Upload Video</h3>
        <button className="close-button" onClick={onClose} disabled={uploading}>
          <FaTimes />
        </button>
      </div>
      
      <div className="upload-content">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!videoFile ? (
            <div 
              className="video-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload size={48} />
              <p>Click to select a video</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="video-preview">
              {videoPreview && (
                <video 
                  src={videoPreview} 
                  controls 
                  style={{ width: '100%', maxHeight: '200px' }}
                />
              )}
              <p>{videoFile.name}</p>
              <button 
                type="button" 
                className="change-video-button"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Change Video
              </button>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={uploading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={uploading}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={uploading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="upload-button"
            disabled={uploading || !videoFile}
          >
            {uploading ? (
              <>
                <FaSpinner className="spinner" />
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload; 