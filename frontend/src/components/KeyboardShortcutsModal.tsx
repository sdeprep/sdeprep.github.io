import React from 'react';

// TODO: Implement dark mode for this modal and the entire website

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
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
    zIndex: 2000,
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '0',
    maxWidth: '750px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 0.3s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    padding: '32px 40px 24px',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#fafbfc',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#0f172a',
    letterSpacing: '-0.025em',
    textAlign: 'left',
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
    color: '#374151',
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
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '32px',
    textAlign: 'center',
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
  };

  const shortcuts = [
    {
      keys: [cmdKey, '/'],
      description: 'Show shortcuts',
    },
    {
      keys: [cmdKey, 'Enter'],
      description: 'Run code',
    },
    {
      keys: [cmdKey, 'D'],
      description: 'Select word',
    },
    {
      keys: [altKey, '↑'],
      description: 'Move line up',
    },
    {
      keys: [altKey, '↓'],
      description: 'Move line down',
    },
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <style>
        {`
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
        `}
      </style>
      <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={{ ...modalStyle, position: 'relative' }}>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
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
      </div>
    </>
  );
};

export default KeyboardShortcutsModal;
