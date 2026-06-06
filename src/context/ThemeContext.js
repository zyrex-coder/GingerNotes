import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      backgroundStart: '#0E1E38',
      backgroundEnd: '#1C3D5A',
      backgroundSolid: '#112345',
      cardBg: '#1E365C',
      cardBorder: '#2E548A',
      text: '#FFFFFF',
      textMuted: '#94A3B8',
      activeTabBg: '#2E5B88',
      activeTabBorder: '#3B82F6',
      inputBg: '#14294A',
      inputBorder: '#244574',
      primary: '#3B82F6',
      secondary: '#2563EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      shadowColor: '#000000',
      divider: '#1E3A5F',
      badgeBg: 'rgba(59, 130, 246, 0.2)',
      badgeText: '#93C5FD',
      glowShadow: 'rgba(59, 130, 246, 0.4)',
    } : {
      backgroundStart: '#E6F0FA',
      backgroundEnd: '#FFFFFF',
      backgroundSolid: '#F0F7FF',
      cardBg: '#FFFFFF',
      cardBorder: '#BFDBFE',
      text: '#1E3A8A',
      textMuted: '#3B82F6',
      activeTabBg: '#DBEAFE',
      activeTabBorder: '#2563EB',
      inputBg: '#F0F7FF',
      inputBorder: '#93C5FD',
      primary: '#2563EB',
      secondary: '#3B82F6',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      purple: '#7C3AED',
      cyan: '#0891B2',
      shadowColor: '#1E3A8A',
      divider: '#CBD9F4',
      badgeBg: 'rgba(37, 99, 235, 0.1)',
      badgeText: '#2563EB',
      glowShadow: 'rgba(37, 99, 235, 0.15)',
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
