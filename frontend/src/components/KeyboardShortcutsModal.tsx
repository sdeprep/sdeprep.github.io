import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// TODO: Implement dark mode for this modal and the entire website

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  // Solarized color palette
  const solarized = {
    base03: '#002b36', // darkest background
    base02: '#073642', // dark background highlights
    base01: '#586e75', // comments, secondary content  
    base00: '#657b83', // primary content
    base0: '#839496',  // body text
    base1: '#93a1a1',  // optional emphasized content
    base2: '#eee8d5',  // background highlights
    base3: '#fdf6e3',  // lightest background
    blue: '#268bd2',
    violet: '#6c71c4'
  };

  // Detect OS for appropriate keyboard symbols
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const altKey = isMac ? '⌥' : 'Alt';

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  };

  // Use different Solarized background from code editor (base02 instead of base03/base3)
  const modalStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
    borderRadius: '16px',
    padding: '0',
    maxWidth: '750px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${solarized.base01}`,
    animation: 'slideIn 0.3s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    padding: '32px 40px 24px',
    borderBottom: `1px solid ${solarized.base01}`,
    backgroundColor: isDarkMode ? solarized.base03 : solarized.base3,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: isDarkMode ? solarized.base1 : solarized.base01,
    letterSpacing: '-0.025em',
    textAlign: 'left',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: isDarkMode ? solarized.base0 : solarized.base01,
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  };

  const contentStyle: React.CSSProperties = {
    padding: '32px 40px 40px',
    maxHeight: '60vh',
    overflow: 'auto',
  };

  const shortcutsListStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    columnGap: '32px',
  };

  const shortcutItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0',
  };

  const descriptionStyle: React.CSSProperties = {
    color: isDarkMode ? solarized.base0 : solarized.base01,
    fontSize: '14px',
    fontWeight: '400',
    flex: 1,
    textAlign: 'left',
  };

  const shortcutKeysStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginLeft: '120px',
  };

  // Increased key size and improved Solarized styling
  const keyStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? solarized.base01 : solarized.base3,
    color: isDarkMode ? solarized.base3 : solarized.base02,
    padding: '10px 16px', // Increased from 6px 12px
    borderRadius: '8px', // Increased from 6px
    fontSize: '16px', // Increased from 12px
    fontWeight: '600',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    border: `2px solid ${isDarkMode ? solarized.base1 : solarized.base01}`, // Increased border width
    boxShadow: isDarkMode
      ? `0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 ${solarized.base0}40`
      : `0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 ${solarized.base3}`,
    minWidth: '36px', // Minimum width for consistency
    textAlign: 'center',
    lineHeight: '1',
  };

  const shortcuts = [
    { description: 'Show shortcuts', keys: [cmdKey, '/'] },
    { description: 'Run code', keys: [cmdKey, 'Enter'] },
    { description: 'Select word', keys: [cmdKey, 'D'] },
    { description: 'Move line up', keys: [altKey, '↑'] },
    { description: 'Move line down', keys: [altKey, '↓'] },
  ];

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>

        <div style={headerStyle}>
          <h2 style={titleStyle}>Keyboard Shortcuts</h2>
          <p style={{ color: isDarkMode ? solarized.base0 : solarized.base00, fontSize: '13px', marginTop: '8px' }}>
            Note: These shortcuts work best when you are not actively typing in the code editor.
          </p>
        </div>

        <div style={contentStyle}>
          <div style={shortcutsListStyle}>
            {shortcuts.map((shortcut, index) => (
              <div key={index} style={shortcutItemStyle}>
                <span style={descriptionStyle}>{shortcut.description}</span>
                <div style={shortcutKeysStyle}>
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} style={keyStyle}>
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default KeyboardShortcutsModal;
