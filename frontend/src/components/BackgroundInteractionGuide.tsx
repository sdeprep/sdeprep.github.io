import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface BackgroundInteractionGuideProps {
    audioLevel: number;
    isListening: boolean;
}

const BackgroundInteractionGuide: React.FC<BackgroundInteractionGuideProps> = ({
    audioLevel,
    isListening
}) => {
    const { isDarkMode } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showHints, setShowHints] = useState(true);
    const [isUserActive, setIsUserActive] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [interactionZones, setInteractionZones] = useState<Array<{
        id: string;
        x: number;
        y: number;
        radius: number;
        active: boolean;
        animation: number;
    }>>([]);

    // Track mouse movement to create subtle interaction zones
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        setIsUserActive(true);

        // Check if mouse is over background (not on UI elements)
        const target = e.target as HTMLElement;
        const isBackground = !target.closest('[data-sidebar]') &&
            !target.closest('.monaco-editor') &&
            !target.closest('button') &&
            !target.closest('a') &&
            !target.closest('[role="button"]');

        if (isBackground && Math.random() < 0.1) { // 10% chance to create interaction zone
            const newZone = {
                id: `zone-${Date.now()}`,
                x: e.clientX,
                y: e.clientY,
                radius: 20 + audioLevel * 30,
                active: true,
                animation: 0
            };

            setInteractionZones(prev => [...prev.slice(-4), newZone]); // Keep max 5 zones
        }
    }, [audioLevel]);

    // Handle clicks on background
    const handleBackgroundClick = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isBackground = !target.closest('[data-sidebar]') &&
            !target.closest('.monaco-editor') &&
            !target.closest('button') &&
            !target.closest('a') &&
            !target.closest('[role="button"]');

        if (isBackground) {
            // Create a celebration effect for background clicks
            const celebrationZone = {
                id: `celebration-${Date.now()}`,
                x: e.clientX,
                y: e.clientY,
                radius: 40 + audioLevel * 60,
                active: true,
                animation: 0
            };

            setInteractionZones(prev => [...prev, celebrationZone]);

            // Hide hints after first background interaction
            setShowHints(false);
        }
    }, [audioLevel]);

    // Auto-hide hints after user becomes active
    useEffect(() => {
        if (isUserActive) {
            const timer = setTimeout(() => setShowHints(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isUserActive]);

    // Setup event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleBackgroundClick);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleBackgroundClick);
        };
    }, [handleMouseMove, handleBackgroundClick]);

    // Animate interaction zones
    useEffect(() => {
        const interval = setInterval(() => {
            setInteractionZones(prev =>
                prev.map(zone => ({
                    ...zone,
                    animation: zone.animation + 1,
                    radius: zone.radius + 0.5,
                    active: zone.animation < 60 // Keep for 1 second at 60fps
                })).filter(zone => zone.active)
            );
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, []);

    const baseColor = isDarkMode
        ? 'rgba(38, 139, 210, 0.15)' // Solarized blue
        : 'rgba(181, 137, 0, 0.15)';  // Solarized yellow

    const pulseColor = isDarkMode
        ? 'rgba(38, 139, 210, 0.3)'
        : 'rgba(181, 137, 0, 0.3)';

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                background: `
          radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, 
            ${pulseColor} 0%, 
            transparent 100px),
          radial-gradient(circle at 20% 20%, ${baseColor} 0%, transparent 200px),
          radial-gradient(circle at 80% 80%, ${baseColor} 0%, transparent 200px)
        `,
                transition: 'background 0.3s ease',
            }}
        >
            {/* Subtle breathing animation overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at center, ${baseColor} 0%, transparent 70%)`,
                    animation: isListening ? 'subtlePulse 3s ease-in-out infinite' : 'none',
                    opacity: 0.3 + audioLevel * 0.2
                }}
            />

            {/* Interaction zones */}
            {interactionZones.map(zone => (
                <div
                    key={zone.id}
                    className="absolute rounded-full"
                    style={{
                        left: zone.x - zone.radius,
                        top: zone.y - zone.radius,
                        width: zone.radius * 2,
                        height: zone.radius * 2,
                        background: `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
                        opacity: Math.max(0, 1 - zone.animation / 60),
                        transform: `scale(${1 + zone.animation * 0.05})`,
                        transition: 'opacity 0.1s ease-out'
                    }}
                />
            ))}

            {/* Gentle hint overlays - only show briefly */}
            {showHints && !isUserActive && (
                <>
                    {/* Corner hints */}
                    <div className="absolute top-8 left-8 opacity-40">
                        <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: isDarkMode ? '#268bd2' : '#b58900' }}
                        />
                    </div>

                    <div className="absolute top-8 right-8 opacity-40">
                        <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{
                                backgroundColor: isDarkMode ? '#268bd2' : '#b58900',
                                animationDelay: '0.5s'
                            }}
                        />
                    </div>

                    <div className="absolute bottom-8 left-8 opacity-40">
                        <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{
                                backgroundColor: isDarkMode ? '#268bd2' : '#b58900',
                                animationDelay: '1s'
                            }}
                        />
                    </div>

                    <div className="absolute bottom-8 right-8 opacity-40">
                        <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{
                                backgroundColor: isDarkMode ? '#268bd2' : '#b58900',
                                animationDelay: '1.5s'
                            }}
                        />
                    </div>

                    {/* Subtle text hint */}
                    <div
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs opacity-30 transition-opacity duration-1000"
                        style={{
                            color: isDarkMode ? '#586e75' : '#657b83',
                            fontFamily: 'system-ui, sans-serif'
                        }}
                    >
                        Click anywhere to create ripples
                    </div>
                </>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.02); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `
            }} />
        </div>
    );
};

export default BackgroundInteractionGuide; 