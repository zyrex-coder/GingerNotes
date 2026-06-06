import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      backgroundStart: '#040D21',
      backgroundEnd: '#081730',
      backgroundSolid: '#061229',
      cardBg: '#0E223D',
      cardBorder: '#1E3A5F',
      text: '#FFFFFF',
      textMuted: '#7C8BA1',
      activeTabBg: '#1B3E63',
      activeTabBorder: '#3B82F6',
      inputBg: '#0A1B33',
      inputBorder: '#162E4C',
      primary: '#3B82F6',
      secondary: '#2563EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      shadowColor: '#000000',
      divider: '#162E4C',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeText: '#60A5FA',
      glowShadow: 'rgba(59, 130, 246, 0.3)',
    } : {
      backgroundStart: '#F0F4FF',
      backgroundEnd: '#FFFFFF',
      backgroundSolid: '#E6EDFF',
      cardBg: '#FFFFFF',
      cardBorder: '#C4D5F2',
      text: '#1E293B',
      textMuted: '#64748B',
      activeTabBg: '#DBEAFE',
      activeTabBorder: '#2563EB',
      inputBg: '#F5F8FF',
      inputBorder: '#B9CEEB',
      primary: '#2563EB',
      secondary: '#3B82F6',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      purple: '#7C3AED',
      cyan: '#0891B2',
      shadowColor: '#0F172A',
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
