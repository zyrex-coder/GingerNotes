import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentScreen } = useNavigation();
  const { width } = useWindowDimensions();

  const isMobile = width < 1024;

  if (!isMobile) {
    // Desktop layout doesn't need a heavy header because the sidebar is persistent
    return null;
  }

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.backgroundSolid, borderBottomColor: theme.colors.cardBorder }]}>
      <View style={styles.left}>
        <View style={[styles.miniLogo, { backgroundColor: 'transparent' }]}>
          <Image source={require('../../assets/logo.jpg')} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
        </View>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {currentScreen === 'Dashboard' ? 'GingerNotes' : currentScreen}
        </Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
          <Ionicons name={theme.isDarkMode ? "sunny-outline" : "moon-outline"} size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
          <Ionicons name="notifications-outline" size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  }
});
