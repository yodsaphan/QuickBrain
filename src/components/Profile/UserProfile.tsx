import React from 'react';
import { FaArrowLeft, FaVideo, FaGamepad, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  watchedVideos: string[];
  gameScores: {videoId: string, score: number}[];
  onBack: () => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, watchedVideos, gameScores, onBack, onLogout }) => {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-white overflow-y-auto">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={onBack}
            >
              <FaArrowLeft className="w-5 h-5" />
          </button>
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          </div>
          {onLogout && (
            <button 
              className="p-2 rounded-full hover:bg-red-50 text-red-600"
              onClick={onLogout}
              title="Logout"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          )}
        </div>
      
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
          <img 
            src={user.profilePic || '/default-profile.jpg'} 
            alt={user.username} 
              className="w-24 h-24 rounded-full object-cover"
          />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
          <p className="text-center text-gray-600">{user.bio || 'No bio yet'}</p>
          
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{watchedVideos.length}</div>
              <div className="text-sm text-gray-600">Watched</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{gameScores.length}</div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {gameScores.reduce((total, current) => total + current.score, 0)}
              </div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 my-6"></div>
        
        <div className="space-y-6">
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FaVideo className="text-blue-500" />
            Recently Watched
          </h4>
            <div className="mt-2 text-gray-600">
            {watchedVideos.length > 0 ? (
              <p>You've watched {watchedVideos.length} videos</p>
            ) : (
              <p>No videos watched yet</p>
            )}
          </div>
        </div>
        
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FaGamepad className="text-blue-500" />
            Quiz Results
          </h4>
            <div className="mt-2 text-gray-600">
            {gameScores.length > 0 ? (
              <p>You've completed {gameScores.length} quizzes</p>
            ) : (
              <p>No quizzes completed yet</p>
            )}
          </div>
        </div>
        
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FaTrophy className="text-blue-500" />
            Achievements
          </h4>
            <div className="mt-2">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaTrophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">First Video</div>
                    <div className="text-sm text-gray-600">Watched your first video</div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 