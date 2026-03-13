/* GitPulse Component */
import React from 'react';
import { Users, UserPlus, Star, Code } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="card profile-card">
      <div className="profile-banner"></div>
      <div className="profile-content">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img 
              src={profile.avatar_url} 
              alt={profile.name || profile.login} 
              className="profile-avatar"
            />
            <div className="avatar-ring"></div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{profile.name || profile.login}</h2>
            <p className="profile-bio">{profile.bio || "No bio available"}</p>
            {profile.location && (
              <span className="profile-location">{profile.location}</span>
            )}
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="stat-pill">
            <Users size={16} />
            <span className="font-mono">{profile.followers.toLocaleString()}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-pill">
            <UserPlus size={16} />
            <span className="font-mono">{profile.following.toLocaleString()}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-pill">
            <Star size={16} />
            <span className="font-mono">{(profile.total_stars || 0).toLocaleString()}</span>
            <span className="stat-label">Stars</span>
          </div>
          <div className="stat-pill">
            <Code size={16} />
            <span className="font-mono">{profile.public_repos.toLocaleString()}</span>
            <span className="stat-label">Repos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
