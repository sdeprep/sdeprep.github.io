import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    visualEffectsEnabled: boolean;
    toggleTheme: () => void;
    toggleVisualEffects: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize from localStorage or default to false
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const [visualEffectsEnabled, setVisualEffectsEnabled] = useState(() => {
        // Initialize from localStorage or default to false
        const savedEffects = localStorage.getItem('visualEffects');
        return savedEffects === 'true'; // Default to false unless explicitly enabled
    });

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleVisualEffects = () => {
        setVisualEffectsEnabled(!visualEffectsEnabled);
    };

    useEffect(() => {
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Apply theme to document body
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    useEffect(() => {
        // Save visual effects preference to localStorage
        localStorage.setItem('visualEffects', visualEffectsEnabled ? 'true' : 'false');
    }, [visualEffectsEnabled]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, visualEffectsEnabled, toggleTheme, toggleVisualEffects }}>
            {children}
        </ThemeContext.Provider>
    );
}; 