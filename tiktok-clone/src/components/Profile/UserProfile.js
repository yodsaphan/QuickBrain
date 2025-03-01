import React, { useState } from 'react';
import { FaUserEdit, FaBookmark, FaHeart, FaLock, FaEllipsisH, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('videos');
  
  // Mock user data (in a real app, this would come from Redux or an API)
  const user = {
    username: '@your_username',
    displayName: 'Your Name',
    bio: 'Welcome to my TikTok profile! 🎬 #developer #creator',
    followers: '10.5K',
    following: '235',
    likes: '142.7K',
    profilePic: 'https://via.placeholder.com/150',
    videos: [
      { id: 1, thumbnail: 'https://via.placeholder.com/150/333', views: '12.4K' },
      { id: 2, thumbnail: 'https://via.placeholder.com/150/444', views: '8.7K' },
      { id: 3, thumbnail: 'https://via.placeholder.com/150/555', views: '24.1K' },
      { id: 4, thumbnail: 'https://via.placeholder.com/150/666', views: '5.3K' },
      { id: 5, thumbnail: 'https://via.placeholder.com/150/777', views: '19.8K' },
      { id: 6, thumbnail: 'https://via.placeholder.com/150/888', views: '7.2K' },
    ],
    likedVideos: [
      { id: 7, thumbnail: 'https://via.placeholder.com/150/999', views: '45.6K' },
      { id: 8, thumbnail: 'https://via.placeholder.com/150/aaa', views: '32.1K' },
      { id: 9, thumbnail: 'https://via.placeholder.com/150/bbb', views: '18.9K' },
    ],
    privateVideos: true
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-actions">
          <FaUserEdit />
          <FaEllipsisH />
        </div>
        <div className="profile-info">
          <div className="profile-pic-large" style={{ backgroundImage: `url(${user.profilePic})` }}></div>
          <h2 className="profile-username">{user.username}</h2>
          <p className="profile-name">{user.displayName}</p>
        </div>
        
        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-count">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{user.likes}</span>
            <span className="stat-label">Likes</span>
          </div>
        </div>
        
        {/* Profile Bio */}
        <div className="profile-bio">
          <p>{user.bio}</p>
        </div>
        
        {/* Profile Actions */}
        <div className="profile-buttons">
          <motion.button 
            className="edit-profile-btn"
            whileTap={{ scale: 0.95 }}
          >
            Edit Profile
          </motion.button>
          <motion.button 
            className="share-profile-btn"
            whileTap={{ scale: 0.95 }}
          >
            <FaShare />
          </motion.button>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="profile-tabs">
        <div 
          className={`profile-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <span className="tab-icon">📹</span>
        </div>
        <div 
          className={`profile-tab ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          <FaHeart />
        </div>
        <div 
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <FaBookmark />
        </div>
        <div 
          className={`profile-tab ${activeTab === 'private' ? 'active' : ''}`}
          onClick={() => setActiveTab('private')}
        >
          <FaLock />
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="profile-content">
        {activeTab === 'videos' && (
          <div className="video-grid">
            {user.videos.map(video => (
              <div key={video.id} className="video-item">
                <div className="video-thumbnail" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                  <div className="video-views">
                    <FaHeart /> {video.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'liked' && (
          <div className="video-grid">
            {user.likedVideos.map(video => (
              <div key={video.id} className="video-item">
                <div className="video-thumbnail" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                  <div className="video-views">
                    <FaHeart /> {video.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'saved' && (
          <div className="empty-state">
            <FaBookmark size={40} />
            <h3>Saved Videos</h3>
            <p>Videos you save will appear here</p>
          </div>
        )}
        
        {activeTab === 'private' && (
          <div className="empty-state">
            <FaLock size={40} />
            <h3>Private Videos</h3>
            <p>Videos visible only to you will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 