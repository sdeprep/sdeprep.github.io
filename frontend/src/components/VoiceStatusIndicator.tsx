import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface VoiceStatusIndicatorProps {
  isListening: boolean;
  isAwakeMode: boolean;
  isPaused: boolean;
  audioLevel: number;
}

const VoiceStatusIndicator: React.FC<VoiceStatusIndicatorProps> = ({
  isListening,
  isAwakeMode,
  isPaused,
  audioLevel,
}) => {
  const { isDarkMode } = useTheme();

  // Solarized color palette
  const solarized = {
    base03: '#002b36',
    base02: '#073642',
    base01: '#586e75',
    base00: '#657b83',
    base0: '#839496',
    base1: '#93a1a1',
    base2: '#eee8d5',
    base3: '#fdf6e3',
    blue: '#268bd2',
    green: '#859900',
    orange: '#cb4b16',
    red: '#dc322f',
  };

  const getStatusInfo = () => {
    if (!isListening) {
      return {
        icon: '🎤',
        text: 'Say "let\'s go" to activate',
        color: isDarkMode ? solarized.base01 : solarized.base1,
        bgColor: isDarkMode ? solarized.base02 : solarized.base2,
      };
    }
    
    if (isPaused) {
      return {
        icon: '⏸️',
        text: 'Paused - say "resume"',
        color: isDarkMode ? solarized.orange : solarized.orange,
        bgColor: isDarkMode ? solarized.base02 : solarized.base2,
      };
    }
    
    if (isAwakeMode) {
      return {
        icon: '🎙️',
        text: 'Listening...',
        color: isDarkMode ? solarized.green : solarized.green,
        bgColor: isDarkMode ? solarized.base02 : solarized.base2,
      };
    }
    
    return {
      icon: '😴',
      text: 'Sleeping - say "let\'s go"',
      color: isDarkMode ? solarized.base01 : solarized.base1,
      bgColor: isDarkMode ? solarized.base02 : solarized.base2,
    };
  };

  const status = getStatusInfo();
  
  // Audio level visualization
  const audioIntensity = Math.min(audioLevel * 3, 1); // Scale up for visibility
  const pulseScale = 1 + (audioIntensity * 0.3);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: status.bgColor,
        color: status.color,
        padding: '12px 16px',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 100,
        border: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <span
        style={{
          fontSize: '16px',
          transform: isAwakeMode && audioLevel > 0.1 ? `scale(${pulseScale})` : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      >
        {status.icon}
      </span>
      <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {status.text}
      </span>
      
      {/* Audio level indicator */}
      {isAwakeMode && (
        <div
          style={{
            width: '4px',
            height: '20px',
            backgroundColor: isDarkMode ? solarized.base01 : solarized.base1,
            borderRadius: '2px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${Math.max(audioLevel * 100, 5)}%`,
              backgroundColor: status.color,
              borderRadius: '2px',
              transition: 'height 0.1s ease',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceStatusIndicator;
