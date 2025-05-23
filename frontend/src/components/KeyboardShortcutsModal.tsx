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

  const modalStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
    borderRadius: '16px',
    padding: '0',
    maxWidth: '750px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${isDarkMode ? '#4a5568' : 'rgba(0, 0, 0, 0.1)'}`,
    animation: 'slideIn 0.3s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    padding: '32px 40px 24px',
    borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#f1f5f9'}`,
    backgroundColor: isDarkMode ? '#374151' : '#fafbfc',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: isDarkMode ? '#f7fafc' : '#0f172a',
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
    color: isDarkMode ? '#a0aec0' : '#6b7280',
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
    color: isDarkMode ? '#cbd5e0' : '#374151',
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

  const keyStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#4a5568' : '#f8fafc',
    color: isDarkMode ? '#f7fafc' : '#1e293b',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    border: `1px solid ${isDarkMode ? '#718096' : '#e2e8f0'}`,
    boxShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
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
