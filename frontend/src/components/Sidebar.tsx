import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  position: string;
}

const positionStyles: { [key: string]: { [key: string]: string } } = {
  left: {
    bgColorClass: 'bg-blue-200',
    borderColorClass: 'border-blue-700',
    textColorClass: 'text-blue-800',
    positionClasses: 'fixed top-0 h-screen w-64',
    peekPositionClasses: '-left-63', // Shows 4px peek
  },
  bottom: {
    bgColorClass: 'bg-green-200',
    borderColorClass: 'border-green-700',
    textColorClass: 'text-green-800',
    positionClasses: 'fixed left-0 right-0 h-48',
    peekPositionClasses: '-bottom-47', // Shows 4px peek
  },
  right: {
    bgColorClass: 'bg-red-200',
    borderColorClass: 'border-red-700',
    textColorClass: 'text-red-800',
    positionClasses: 'fixed top-0 h-screen w-64',
    peekPositionClasses: '-right-63', // Shows 4px peek
  },
  default: {
    bgColorClass: 'bg-gray-200',
    borderColorClass: 'border-gray-700',
    textColorClass: 'text-gray-800',
    positionClasses: '',
    peekPositionClasses: '',
  },
};

const Sidebar: React.FC<SidebarProps> = ({ position }) => {
  const [isHidden, setIsHidden] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  const transitionClasses = 'transition-all duration-300 ease-in-out';

  const styles = positionStyles[position] || positionStyles.default;

  const currentPositionClass = isHidden
    ? styles.peekPositionClasses
    : position === 'left'
      ? 'left-0'
      : position === 'right'
        ? 'right-0'
        : position === 'bottom'
          ? 'bottom-0'
          : '';

  const sidebarStyles: { [key: string]: React.CSSProperties } = {
    left: { borderTopRightRadius: '12px', borderBottomRightRadius: '12px' },
    right: { borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' },
    bottom: { borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
    default: {},
  };

  const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    width: '60px',
    height: '30px',
    backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
    border: '2px solid #cbd5e0',
  };

  const toggleKnobStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: isDarkMode ? '32px' : '2px',
    width: '22px',
    height: '22px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'left 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
  };

  return (
    <div
      className={`sidebar p-4 border-4 flex flex-col justify-center items-center ${styles.bgColorClass} ${styles.borderColorClass} ${styles.textColorClass} ${styles.positionClasses} ${currentPositionClass} ${transitionClasses}`}
      style={{ ...sidebarStyles[position], zIndex: 10 }}
      onMouseEnter={() => setIsHidden(false)}
      onMouseLeave={() => setIsHidden(true)}
    >
      <SidebarOpener parentSidebarPosition={position} setIsParentSidebarHidden={setIsHidden} />

      <div style={{ fontSize: '14px', fontWeight: '500', color: '#6c757d' }}>
        {position === 'left' && '❓ Questions'}
        {position === 'bottom' && '🤖 AI Interaction'}
        {position === 'right' && '⚙️ Settings'}
      </div>

      {position === 'right' && (
        <div style={toggleSwitchStyle} onClick={toggleTheme}>
          <div style={toggleKnobStyle}>
            {isDarkMode ? (
              // Moon icon for dark mode
              <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
