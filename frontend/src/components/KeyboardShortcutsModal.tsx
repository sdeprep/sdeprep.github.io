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
    background: 'none',
    border: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
    borderRadius: '50%',
    fontSize: '24px',
    cursor: 'pointer',
    color: isDarkMode ? solarized.base0 : solarized.base00,
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    marginLeft: 'auto',
    lineHeight: '1',
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

  // Function to check if a key is a symbol
  const isSymbolKey = (key: string) => {
    return key === cmdKey || key === altKey || key === '↑' || key === '↓';
  };

  // Function to get dynamic key style based on whether it's a symbol
  const getDynamicKeyStyle = (key: string): React.CSSProperties => {
    const baseStyle = keyStyle; // Start with the base style
    if (isSymbolKey(key)) {
      return {
        ...baseStyle,
        fontSize: '20px', // Increased font size for symbols (e.g., 16 + 4 = 20)
        lineHeight: '1', // Ensure vertical alignment for symbols
        padding: '8px 12px', // Adjust padding slightly for larger symbols
      };
    } else {
      return baseStyle;
    }
  };

  const codeEditorShortcuts = [
    { description: 'Run code', keys: [cmdKey, 'Enter'] },
    { description: 'Select word', keys: [cmdKey, 'D'] },
    { description: 'Move line up', keys: [altKey, '↑'] },
    { description: 'Move line down', keys: [altKey, '↓'] },
  ];

  const websiteShortcuts = [
    { description: 'Show/Hide shortcuts', keys: [cmdKey, '/'] },
    { description: 'Close modal', keys: ['Escape'] },
  ];

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...headerStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ ...titleStyle, marginBottom: '0' }}>Keyboard Shortcuts</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={contentStyle}>
          {/* Code Editor Shortcuts */}
          <h3 style={{ color: isDarkMode ? solarized.base0 : solarized.base00, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Code Editor</h3>
          <div className="flex flex-col gap-[20px] mb-8">
            {codeEditorShortcuts.map((shortcut, index) => (
              <div key={index} style={shortcutItemStyle}>
                <span style={descriptionStyle}>{shortcut.description}</span>
                <div style={shortcutKeysStyle}>
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} style={getDynamicKeyStyle(key)}>
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Separator Line */}
          <hr style={{ borderTop: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`, margin: '20px 40px' }} />

          {/* Website Shortcuts */}
          <h3 style={{ color: isDarkMode ? solarized.base0 : solarized.base00, fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: '24px' }}>Website</h3>
          <div className="flex flex-col gap-[20px]">
            {websiteShortcuts.map((shortcut, index) => (
              <div key={index} style={shortcutItemStyle}>
                <span style={descriptionStyle}>{shortcut.description}</span>
                <div style={shortcutKeysStyle}>
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} style={getDynamicKeyStyle(key)}>
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
