import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const Card = ({ children, style, outline = false }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.colors.cardBg, 
        borderColor: outline ? theme.colors.primary : theme.colors.cardBorder 
      }, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  }
});
