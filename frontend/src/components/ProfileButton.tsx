import React from 'react';

const ProfileButton: React.FC = () => {
  const profileButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#e9ecef';
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#f8f9fa';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div
      style={profileButtonStyle}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      title="Profile"
    >
      {/* Simple minimalistic profile SVG icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6c757d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
};

export default ProfileButton;
