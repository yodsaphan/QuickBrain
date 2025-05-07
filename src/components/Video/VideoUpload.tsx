import React, { useState, useRef } from 'react';
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { videoService } from '@/services/videoService';

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate video file
    const validation = videoService.validateVideoFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid video file');
      return;
    }
    
    setVideoFile(file);
    setError('');
    
    // Create video preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    
    // Generate thumbnail preview
    try {
      const thumbnailUrl = await videoService.generateThumbnail(file);
      setThumbnailPreview(thumbnailUrl);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate thumbnail file
    const validation = videoService.validateThumbnailFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid thumbnail file');
      return;
    }
    
    setThumbnailFile(file);
    setError('');
    
    // Create thumbnail preview
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to upload videos');
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
      // Upload video
      const video = await videoService.uploadVideo(videoFile, {
        title,
        description,
        subject,
        topic,
        userId: user.id,
      });
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbnailUrl = await videoService.uploadThumbnail(thumbnailFile, user.id);
        // Update video document with thumbnail URL
        // You'll need to implement this in your videoService
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to upload video');
      setUploading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upload Video</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={uploading}
          >
          <FaTimes />
        </button>
      </div>
      
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!videoFile ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Click to select a video</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
              {videoPreview && (
                <video 
                  src={videoPreview} 
                  controls 
                    className="w-full rounded-lg"
                />
              )}
              <button 
                type="button" 
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                  <FaTimes />
              </button>
              </div>
              
              <div className="relative">
                {thumbnailPreview ? (
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <p className="text-gray-500">Click to select a thumbnail</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={uploading}
            />
          </div>
          
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
          </div>
          
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              />
            </div>
            
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={uploading || !videoFile}
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
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