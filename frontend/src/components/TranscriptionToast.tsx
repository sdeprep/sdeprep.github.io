import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TranscriptionToastProps {
    isVisible: boolean;
    message: string;
    isListening: boolean;
}

const TranscriptionToast: React.FC<TranscriptionToastProps> = ({
    isVisible,
    message,
    isListening
}) => {
    const { isDarkMode } = useTheme();
    const [displayMessage, setDisplayMessage] = useState(message);
    const [isAnimating, setIsAnimating] = useState(false);

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
    };

    // Smooth message transitions without component remounting
    useEffect(() => {
        if (message !== displayMessage) {
            setIsAnimating(true);

            // Quick fade transition for smooth updates
            const timer = setTimeout(() => {
                setDisplayMessage(message);
                setIsAnimating(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [message, displayMessage]);

    // Don't render if not visible
    if (!isVisible) return null;

    const toastStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
        color: isDarkMode ? solarized.base0 : solarized.base00,
        padding: '16px 24px',
        borderRadius: '12px',
        border: 'none',
        boxShadow: isDarkMode
            ? '0 12px 24px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
            : '0 12px 24px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)',
        maxWidth: '400px',
        textAlign: 'center' as const,
        fontSize: '14px',
        fontWeight: '500',
        transition: 'opacity 0.1s ease', // Smooth content transitions
        opacity: isAnimating ? 0.7 : 1,
        // Only animate pulse when showing "Listening..." and actually listening
        animation: (displayMessage === 'Listening...' && isListening) ? 'pulse 1.5s infinite' : 'none',
    };

    return (
        <>
            <style>
                {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: translateX(-50%) scale(1.02);
            }
          }
        `}
            </style>
            <div data-toast style={toastStyle}>
                {displayMessage}
            </div>
        </>
    );
};

export default TranscriptionToast; 