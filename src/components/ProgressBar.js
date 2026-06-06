import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ProgressBar = ({ progress, color, showPercent = false, label }) => {
  const { theme } = useTheme();
  
  // Cap progress between 0 and 100
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
          {showPercent && <Text style={[styles.percent, { color: color || theme.colors.primary }]}>{percentage}%</Text>}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: theme.isDarkMode ? '#1F2552' : '#E2E8F0' }]}>
        <View style={[
          styles.fill, 
          { 
            width: `${percentage}%`, 
            backgroundColor: color || theme.colors.primary,
            shadowColor: color || theme.colors.primary,
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percent: {
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }
});
