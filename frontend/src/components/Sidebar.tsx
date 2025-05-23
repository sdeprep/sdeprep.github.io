import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';
import { useTheme } from '../contexts/ThemeContext';
import { useQuestions } from '../contexts/QuestionContext';

interface SidebarProps {
  position: string;
  onShowShortcuts?: () => void;
}

const positionStyles: { [key: string]: { [key: string]: string } } = {
  left: {
    positionClasses: 'fixed top-0 h-screen w-64',
    peekPositionClasses: '-left-63', // Shows 4px peek
  },
  bottom: {
    positionClasses: 'fixed left-0 right-0 h-48',
    peekPositionClasses: '-bottom-47', // Shows 4px peek
  },
  right: {
    positionClasses: 'fixed top-0 h-screen w-64',
    peekPositionClasses: '-right-63', // Shows 4px peek
  },
  default: {
    positionClasses: '',
    peekPositionClasses: '',
  },
};

const Sidebar: React.FC<SidebarProps> = ({ position, onShowShortcuts }) => {
  const [isHidden, setIsHidden] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { questions, selectedQuestion, selectQuestion } = useQuestions();

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

  const buttonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '2px solid #cbd5e0',
    backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    width: '40px',
    height: '40px',
    backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    border: '2px solid #cbd5e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const toggleKnobStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isDarkMode ? 'translateX(0px)' : 'translateX(0px)',
  };

  const iconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
  };

  const baseClasses = `sidebar p-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div
      className={`${baseClasses} ${styles.positionClasses} ${currentPositionClass} ${transitionClasses} flex flex-col`}
      style={{ ...sidebarStyles[position], zIndex: 10 }}
      onMouseEnter={() => setIsHidden(false)}
      onMouseLeave={() => setIsHidden(true)}
    >
      <SidebarOpener parentSidebarPosition={position} setIsParentSidebarHidden={setIsHidden} />

      {/* Three Buttons Row - for right sidebar */}
      {position === 'right' && (
        <div className="flex justify-between items-center mb-6 gap-2">
          {/* Keyboard Shortcuts Button - Left */}
          <div
            style={buttonStyle}
            onClick={onShowShortcuts}
            className="hover:scale-105"
          >
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#e2e8f0' : '#4a5568'} strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          {/* Theme Toggle - Center */}
          <div style={toggleSwitchStyle} onClick={toggleTheme} className="hover:scale-105">
            <div style={toggleKnobStyle}>
              {isDarkMode ? (
                // Moon icon for dark mode
                <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                // Sun icon for light mode
                <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
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

          {/* Profile Button - Right */}
          <div
            style={buttonStyle}
            className="hover:scale-105"
          >
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#e2e8f0' : '#4a5568'} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      )}

      {/* Questions List for Left Sidebar */}
      {position === 'left' && (
        <div className="flex flex-col h-full">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Questions
          </h3>
          <div className="flex-1 overflow-y-auto">
            {questions.map((question) => (
              <div
                key={question.id}
                onClick={() => selectQuestion(question)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedQuestion?.id === question.id
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <div className="font-medium text-sm">{question.title}</div>
                <div className={`text-xs mt-1 ${question.difficulty === 'Easy'
                  ? 'text-green-500'
                  : question.difficulty === 'Medium'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                  }`}>
                  {question.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for other sidebars */}
      {position === 'bottom' && (
        <div className="flex flex-col justify-center items-center h-full">
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            AI Interaction
          </div>
        </div>
      )}

      {position === 'right' && (
        <div className="flex flex-col justify-center items-center flex-1">
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Settings
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
