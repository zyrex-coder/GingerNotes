import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      backgroundStart: '#080B1E',
      backgroundEnd: '#0E1332',
      backgroundSolid: '#0B0F2A',
      cardBg: '#141935',
      cardBorder: '#232B5C',
      text: '#FFFFFF',
      textMuted: '#7C8BA1',
      activeTabBg: '#1E295D',
      activeTabBorder: '#3B82F6',
      inputBg: '#111530',
      inputBorder: '#1F2552',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      shadowColor: '#000000',
      divider: '#1F2552',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeText: '#60A5FA',
      glowShadow: 'rgba(59, 130, 246, 0.3)',
    } : {
      backgroundStart: '#F3F7FC',
      backgroundEnd: '#FFFFFF',
      backgroundSolid: '#F0F4FA',
      cardBg: '#FFFFFF',
      cardBorder: '#E2E8F0',
      text: '#1E293B',
      textMuted: '#64748B',
      activeTabBg: '#EFF6FF',
      activeTabBorder: '#2563EB',
      inputBg: '#F8FAFC',
      inputBorder: '#CBD5E1',
      primary: '#2563EB',
      secondary: '#3B82F6',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      purple: '#7C3AED',
      cyan: '#0891B2',
      shadowColor: '#0F172A',
      divider: '#E2E8F0',
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
