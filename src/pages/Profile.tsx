import React from 'react';
import '../css/ProfileSummary.css';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProfileLogout from "../styles/ProfileLogout.tsx"

interface ProfileSummaryProps {
  userName: string;
  profilePic: string;
  totalSections: number;
  completedSections: number;
  lastSection: string;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  userName,
  profilePic,
  totalSections,
  completedSections,
  lastSection,
}) => {
  const progress = Math.round((completedSections / totalSections) * 100);

  const getBadge = (progress: number) => {
    if (progress < 50) return 'Beginner';
    if (progress < 80) return 'Intermediate';
    return 'Pro';
  };

  return (
    <div className="profile-summary-container">
      {/* Avatar */}
      <div className="avatar-container">
        <Avatar alt={userName} src={profilePic} sx={{ width: 80, height: 80 }} />
        
      <Typography variant="h6" sx={{color:'green'}}>
       <strong> {userName} </strong>
      </Typography>
      
      </div>

      {/* Center Details */}
      <div className="details-container">
        
        <Typography >
          <strong>Course:</strong> CCNA IPv4 Addressing
        </Typography>
        <Typography >
          <strong>Sections Completed:</strong> {completedSections} / {totalSections}
        </Typography>
        <Typography >
          <strong>Last Completed:</strong> {lastSection}
        </Typography>
        <Typography>
          <strong>Badge:</strong> {getBadge(progress)}
        </Typography>
      </div>

      {/* Progress Circle */}
      <div className="progress-container">
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={5}
            style={{ color: '#4caf50' }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" >
              {`${progress}%`}
            </Typography>
            
          </Box>
        </Box>
      </div>

      <ProfileLogout />
    </div>
  );
};

export default ProfileSummary;