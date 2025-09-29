import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

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
    blue: '#268bd2',   // Solarized blue
    green: '#859900',  // Solarized green
    orange: '#cb4b16', // Solarized orange
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? solarized.base02 : solarized.base3,
          color: isDarkMode ? solarized.base0 : solarized.base00,
          padding: '32px',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          margin: '20px',
          boxShadow: isDarkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.8)' 
            : '0 20px 60px rgba(0, 0, 0, 0.2)',
          animation: 'slideIn 0.3s ease-out',
          border: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          marginBottom: '20px',
          color: isDarkMode ? solarized.base1 : solarized.base00,
          textAlign: 'center'
        }}>
          🎤 Welcome to SDE Speed Run
        </h1>
        
        <p style={{ 
          fontSize: '18px', 
          lineHeight: '1.6',
          marginBottom: '24px',
          color: isDarkMode ? solarized.base0 : solarized.base00,
        }}>
          A coding interview preparation platform with <strong>voice interface experiments</strong>. 
          Practice algorithmic problems in a clean, focused environment with auto-save functionality.
        </p>

        <div style={{ 
          backgroundColor: isDarkMode ? solarized.base03 : solarized.base2,
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
        }}>
          <h4 style={{ 
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            color: isDarkMode ? solarized.blue : solarized.blue,
          }}>
            🚧 Current Status: Early Prototype
          </h4>
          <p style={{ 
            fontSize: '14px',
            lineHeight: '1.5',
            color: isDarkMode ? solarized.base0 : solarized.base00,
            margin: 0,
          }}>
            This is an experimental platform. Voice commands currently only control basic functions (start/pause/resume). 
            Voice-to-code functionality is planned for future development.
          </p>
        </div>

        {/* Two column layout for better space utilization */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px',
          marginBottom: '24px',
        }}>
          {/* Left column - What Works Now */}
          <div>
            <h3 style={{ 
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: isDarkMode ? solarized.blue : solarized.blue,
            }}>
              ✅ What Works Now
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              fontSize: '15px',
              lineHeight: '1.6',
            }}>
              <li style={{ marginBottom: '6px' }}>
                • Browse problems by category
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Auto-save as you type
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Dark/light Solarized themes
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Import/export via iCloud sync
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Voice commands: 
                <code style={{ 
                  backgroundColor: isDarkMode ? solarized.base03 : solarized.base2,
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  margin: '0 2px',
                }}>
                  "let's go"
                </code>
                <code style={{ 
                  backgroundColor: isDarkMode ? solarized.base03 : solarized.base2,
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  margin: '0 2px',
                }}>
                  "pause"
                </code>
              </li>
            </ul>
          </div>

          {/* Right column - Future Plans */}
          <div>
            <h3 style={{ 
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: isDarkMode ? solarized.orange : solarized.orange,
            }}>
              🚧 Future Vision
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              fontSize: '15px',
              lineHeight: '1.6',
              color: isDarkMode ? solarized.base01 : solarized.base1,
            }}>
              <li style={{ marginBottom: '6px' }}>
                • Voice-to-code dictation
              </li>
              <li style={{ marginBottom: '6px' }}>
                • AI mentor conversations
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Speed run timing
              </li>
              <li style={{ marginBottom: '6px' }}>
                • "Next problem" navigation
              </li>
              <li style={{ marginBottom: '6px' }}>
                • Real-time hints & explanations
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '12px',
            color: isDarkMode ? solarized.blue : solarized.blue,
            textAlign: 'center',
          }}>
            🚀 Quick Start
          </h3>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '14px',
            color: isDarkMode ? solarized.base0 : solarized.base00,
          }}>
            <span>1. Pick a problem category</span>
            <span>→</span>
            <span>2. Select a problem</span>
            <span>→</span>
            <span>3. Start coding!</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: isDarkMode ? solarized.blue : solarized.blue,
              color: isDarkMode ? solarized.base3 : solarized.base3,
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(38, 139, 210, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Got it! Let's start coding 🚀
          </button>
          
          {/* Creator credit */}
          <div style={{ 
            fontSize: '13px',
            color: isDarkMode ? solarized.base01 : solarized.base1,
            textAlign: 'center',
          }}>
            Built by{' '}
            <a 
              href="https://aviralgarg.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: isDarkMode ? solarized.blue : solarized.blue,
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Aviral Garg
            </a>
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
            transform: translateY(-30px) scale(0.95); 
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

export default WelcomeModal;
