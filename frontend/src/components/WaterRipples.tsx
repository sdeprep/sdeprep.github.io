import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface WaterRipplesProps {
    audioLevel: number;
    isListening: boolean;
}

interface Ripple {
    x: number;
    y: number;
    age: number;
    maxAge: number;
    growthSpeed: number;
    amplitude: number;
    wavelength: number;
    ringWidth: number;
    initialRadius: number;
    fade: number;
}

const WaterRipples: React.FC<WaterRipplesProps> = ({ audioLevel, isListening }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const ripplesRef = useRef<Ripple[]>([]);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const lastRippleTimeRef = useRef(0);
    const isTabVisibleRef = useRef(true);
    const needsUpdateRef = useRef(false);
    const { isDarkMode } = useTheme();

    // Performance-optimized settings
    const SETTINGS = {
        maxRipples: 15, // Limit for performance
        rippleThreshold: 0.15, // Minimum audio level to create ripples
        rippleInterval: 150, // Minimum ms between ripples
        baseGrowthSpeed: 1.5,
        audioGrowthMultiplier: 2.5,
        baseAmplitude: 25,
        audioAmplitudeMultiplier: 40,
        wavelength: 30,
        ringWidth: 8,
        maxAge: 120,
        fadeSpeed: 0.008,
    };

    // Solarized colors for ripples
    const solarized = {
        blue: { r: 38, g: 139, b: 210 }, // Solarized blue
        yellow: { r: 181, g: 137, b: 0 }, // Solarized yellow
    };

    const [isReducedMotion, setIsReducedMotion] = useState(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // Handle reduced motion preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = () => setIsReducedMotion(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    // Handle tab visibility for performance
    useEffect(() => {
        const handleVisibilityChange = () => {
            isTabVisibleRef.current = document.visibilityState === 'visible';
            if (isTabVisibleRef.current) {
                needsUpdateRef.current = true;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Setup canvas and handle resize
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }

        needsUpdateRef.current = true;
    }, []);

    // Handle mouse movement
    const handleMouseMove = useCallback((event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mousePositionRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }, []);

    // Create ripple at current mouse position
    const createRipple = useCallback((audioIntensity: number) => {
        const now = Date.now();
        if (now - lastRippleTimeRef.current < SETTINGS.rippleInterval) return;

        const { x, y } = mousePositionRef.current;

        // Calculate ripple properties based on audio level
        const growthSpeed = SETTINGS.baseGrowthSpeed + (audioIntensity * SETTINGS.audioGrowthMultiplier);
        const amplitude = SETTINGS.baseAmplitude + (audioIntensity * SETTINGS.audioAmplitudeMultiplier);
        const maxAge = SETTINGS.maxAge * (0.8 + audioIntensity * 0.4); // Longer life for louder sounds

        const ripple: Ripple = {
            x,
            y,
            age: 0,
            maxAge,
            growthSpeed,
            amplitude,
            wavelength: SETTINGS.wavelength,
            ringWidth: SETTINGS.ringWidth,
            initialRadius: audioIntensity * 15, // Larger initial radius for louder sounds
            fade: 1,
        };

        ripplesRef.current.push(ripple);
        lastRippleTimeRef.current = now;

        // Remove oldest ripples if we exceed max count
        if (ripplesRef.current.length > SETTINGS.maxRipples) {
            ripplesRef.current.shift();
        }

        needsUpdateRef.current = true;
    }, [SETTINGS.audioAmplitudeMultiplier, SETTINGS.audioGrowthMultiplier, SETTINGS.baseAmplitude, SETTINGS.baseGrowthSpeed, SETTINGS.maxAge, SETTINGS.maxRipples, SETTINGS.ringWidth, SETTINGS.rippleInterval, SETTINGS.wavelength]);

    // Draw single ripple
    const drawRipple = useCallback((ctx: CanvasRenderingContext2D, ripple: Ripple) => {
        const radius = ripple.initialRadius + ripple.age * ripple.growthSpeed;
        const fadeProgress = ripple.age / ripple.maxAge;
        const opacity = (1 - fadeProgress) * ripple.fade;

        if (opacity <= 0.01) return; // Skip nearly invisible ripples

        // Use solarized colors based on theme
        const color = isDarkMode ? solarized.blue : solarized.yellow;

        // Create gradient for more realistic water effect
        const gradient = ctx.createRadialGradient(
            ripple.x, ripple.y, radius - ripple.ringWidth,
            ripple.x, ripple.y, radius + ripple.ringWidth
        );

        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.save();
        ctx.globalCompositeOperation = 'screen'; // Blend mode for water-like effect
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ripple.ringWidth;
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Add inner highlight for depth
        if (opacity > 0.3) {
            const innerGradient = ctx.createRadialGradient(
                ripple.x, ripple.y, radius * 0.7,
                ripple.x, ripple.y, radius * 0.9
            );

            innerGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            innerGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`);

            ctx.strokeStyle = innerGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }, [isDarkMode, solarized.blue, solarized.yellow]);

    // Main animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !isTabVisibleRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
            return;
        }

        // Only render when needed
        if (!needsUpdateRef.current && ripplesRef.current.length === 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

        // Update and draw ripples
        ripplesRef.current = ripplesRef.current.filter(ripple => {
            ripple.age++;
            ripple.fade = Math.max(0, ripple.fade - SETTINGS.fadeSpeed);

            if (ripple.age < ripple.maxAge && ripple.fade > 0.01) {
                drawRipple(ctx, ripple);
                return true;
            }
            return false;
        });

        // Create new ripples based on audio level
        if (isListening && audioLevel > SETTINGS.rippleThreshold && !isReducedMotion) {
            // Probability of creating ripple based on audio level
            const rippleProbability = Math.min(audioLevel * 0.8, 0.6);
            if (Math.random() < rippleProbability) {
                createRipple(audioLevel);
            }
        }

        needsUpdateRef.current = false;
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [audioLevel, isListening, isReducedMotion, createRipple, drawRipple, SETTINGS.fadeSpeed, SETTINGS.rippleThreshold]);

    // Initialize canvas and start animation
    useEffect(() => {
        setupCanvas();

        const handleResize = () => {
            setTimeout(setupCanvas, 100); // Debounce resize
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        // Start animation loop
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [setupCanvas, handleMouseMove, animate]);

    // Update when theme changes
    useEffect(() => {
        needsUpdateRef.current = true;
    }, [isDarkMode]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: isListening ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}
        />
    );
};

export default WaterRipples; 