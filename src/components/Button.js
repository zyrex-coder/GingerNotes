import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const Button = ({ title, onPress, variant = 'primary', size = 'medium', loading = false, disabled = false, style, icon }) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.isDarkMode ? '#1F2552' : '#CBD5E1';
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      case 'danger': return theme.colors.error;
      case 'outline': return 'transparent';
      case 'glass': return theme.colors.badgeBg;
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.isDarkMode ? '#7C8BA1' : '#64748B';
    if (variant === 'outline') return theme.colors.primary;
    if (variant === 'glass') return theme.colors.badgeText;
    return '#FFFFFF';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    if (variant === 'glass') return theme.colors.cardBorder;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' || variant === 'glass' ? 1.5 : 0,
          paddingVertical: size === 'small' ? 8 : size === 'large' ? 14 : 12,
          paddingHorizontal: size === 'small' ? 14 : size === 'large' ? 24 : 18,
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor(), marginLeft: icon ? 8 : 0 }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  }
});
