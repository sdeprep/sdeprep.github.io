import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';
import { useTheme } from '../contexts/ThemeContext';
import { useQuestions } from '../contexts/QuestionContext';

interface SidebarProps {
  position: 'left' | 'right' | 'bottom';
  onShowShortcuts?: () => void;
  'data-sidebar'?: boolean;
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

const Sidebar: React.FC<SidebarProps> = ({ position, onShowShortcuts, ...props }) => {
  const [isHidden, setIsHidden] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { questions, selectedQuestion, selectQuestion } = useQuestions();

  // Solarized color palette
  const solarized = {
    base03: '#002b36', // darkest
    base02: '#073642', // dark background highlights
    base01: '#586e75', // comments, secondary content  
    base00: '#657b83', // primary content
    base0: '#839496',  // body text
    base1: '#93a1a1',  // optional emphasized content
    base2: '#eee8d5',  // background highlights
    base3: '#fdf6e3',  // lightest background
    blue: '#268bd2',
    cyan: '#2aa198',
    green: '#859900',
    yellow: '#b58900',
    orange: '#cb4b16',
    red: '#dc322f',
    magenta: '#d33682',
    violet: '#6c71c4'
  };

  const handleiCloudSyncDownload = () => {
    const themeState = localStorage.getItem('theme');
    const selectedQuestionId = localStorage.getItem('selectedQuestionId');

    // Get all saved code snippets
    const savedCode: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('code_')) {
        const questionId = key.replace('code_', '');
        const code = localStorage.getItem(key);
        if (code !== null) {
          savedCode[questionId] = code;
        }
      }
    }

    const syncData = {
      theme: themeState,
      selectedQuestionId: selectedQuestionId,
      savedCode: savedCode,
    };

    const json = JSON.stringify(syncData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sde_sync_data.json'; // Suggested filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Please download the file to your desired iCloud drive folder (preferred location would be iCloud drive / SDE).');
  };

  const handleiCloudSyncUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const syncData = JSON.parse(content);

        // Update localStorage with uploaded data
        // This triggers the useEffect hooks in ThemeContext, QuestionContext,
        // and CodeEditor, which read from localStorage and update component state.
        if (syncData.theme !== undefined) {
          localStorage.setItem('theme', syncData.theme);
        }
        if (syncData.selectedQuestionId !== undefined) {
          localStorage.setItem('selectedQuestionId', syncData.selectedQuestionId);
          // Trigger question selection to update UI explicitly if needed, though useEffect should cover it
          const questionToSelect = questions.find(q => q.id === syncData.selectedQuestionId);
          if (questionToSelect) {
            selectQuestion(questionToSelect);
          }
        }
        if (syncData.savedCode) {
          Object.keys(syncData.savedCode).forEach(questionId => {
            localStorage.setItem(`code_${questionId}`, syncData.savedCode[questionId]);
          });
        }

        alert('Sync data uploaded and applied!');

        // Reload the page to ensure all contexts re-initialize from localStorage reliably.
        // While hooks should catch changes, a reload is a simple way to guarantee fresh state.
        window.location.reload();

      } catch (error) {
        alert('Error reading or parsing sync file.' + error);
        console.error('Error reading or parsing sync file:', error);
      }
    };
    reader.readAsText(file);
  };

  const triggerUpload = () => {
    document.getElementById('icloud-sync-upload-input')?.click();
  };

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
    border: `2px solid ${solarized.base01}`,
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
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
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    border: `2px solid ${solarized.base01}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const toggleKnobStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: isDarkMode ? solarized.base3 : solarized.base3,
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: `0 2px 4px ${solarized.base01}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isDarkMode ? 'translateX(0px)' : 'translateX(0px)',
  };

  const iconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
  };

  const baseClasses = `sidebar p-4 border`;
  const solarizedBg = isDarkMode ? solarized.base03 : solarized.base3;
  const solarizedBorder = solarized.base01;
  const solarizedText = isDarkMode ? solarized.base0 : solarized.base00;

  const sidebarClasses = `${baseClasses} ${styles.positionClasses} ${currentPositionClass} ${transitionClasses} flex flex-col`;
  const sidebarStyle = {
    ...sidebarStyles[position],
    zIndex: 10,
    backgroundColor: solarizedBg,
    borderColor: solarizedBorder,
    color: solarizedText
  };

  return (
    <div
      className={sidebarClasses}
      style={sidebarStyle}
      onMouseEnter={() => setIsHidden(false)}
      onMouseLeave={() => setIsHidden(true)}
      {...props}
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
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={solarizedText} strokeWidth="2">
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <path d="M6 10h2" />
              <path d="M10 10h2" />
              <path d="M14 10h2" />
              <path d="M18 10h2" />
              <path d="M6 14h8" />
              <path d="M16 14h4" />
            </svg>
          </div>

          {/* iCloud Sync Download Button - Left Center */}
          <div
            style={buttonStyle}
            onClick={handleiCloudSyncDownload}
            className="hover:scale-105"
          >
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={solarizedText} strokeWidth="2">
              <path d="M12 7v14" />
              <path d="M19 14l-7 7-7-7" />
              <path d="M21 3H3" />
            </svg>
          </div>

          {/* iCloud Sync Upload Button - Right Center */}
          <div
            style={buttonStyle}
            onClick={triggerUpload}
            className="hover:scale-105"
          >
            <input type="file" id="icloud-sync-upload-input" style={{ display: 'none' }} onChange={handleiCloudSyncUpload} accept=".json" />
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={solarizedText} strokeWidth="2">
              <path d="M12 17V3" />
              <path d="M5 10L12 3 19 10" />
              <path d="M21 21H3" />
            </svg>
          </div>

          {/* Theme Toggle - Right Center */}
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
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={solarizedText} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      )}

      {/* Questions List for Left Sidebar */}
      {position === 'left' && (
        <div className="flex flex-col h-full">
          <h3 className={`text-lg font-semibold mb-4`} style={{ color: solarizedText }}>
            Questions
          </h3>
          <div className="flex-1 overflow-y-auto">
            {questions.map((question) => (
              <div
                key={question.id}
                onClick={() => selectQuestion(question)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200`}
                style={{
                  backgroundColor: selectedQuestion?.id === question.id
                    ? solarized.blue
                    : (isDarkMode ? solarized.base02 : solarized.base2),
                  color: selectedQuestion?.id === question.id
                    ? solarized.base3
                    : solarizedText,
                  border: `1px solid ${solarized.base01}`,
                }}
                onMouseEnter={(e) => {
                  if (selectedQuestion?.id !== question.id) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? solarized.base01 : solarized.base1;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedQuestion?.id !== question.id) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? solarized.base02 : solarized.base2;
                  }
                }}
              >
                <div className="font-medium text-sm">{question.title}</div>
                <div className={`text-xs mt-1`} style={{
                  color: question.difficulty === 'Easy'
                    ? solarized.green
                    : question.difficulty === 'Medium'
                      ? solarized.yellow
                      : solarized.red
                }}>
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
          <div className={`text-sm font-medium`} style={{ color: solarizedText }}>
            AI Interaction
          </div>
        </div>
      )}

      {position === 'right' && (
        <div className="flex flex-col justify-center items-center flex-1">
          {/* Remove the Settings text */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
