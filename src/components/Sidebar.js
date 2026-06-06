import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, useWindowDimensions, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentScreen, navigate } = useNavigation();
  const { width } = useWindowDimensions();

  const isMobile = width < 1024;

  const menuItems = [
    { name: 'Dashboard', label: 'My Notes', icon: 'book-outline' },
    { name: 'Scan Notes', label: 'Scan Notes', icon: 'camera-outline' },
    { name: 'Study Planner', label: 'Study Planner', icon: 'calendar-outline' },
  ];

  if (isMobile) {
    // Return bottom tabs on mobile sizes
    return (
      <View style={[styles.bottomTab, { backgroundColor: theme.colors.cardBg, borderTopColor: theme.colors.cardBorder }]}>
        {menuItems.map(item => {
          const isActive = currentScreen === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => navigate(item.name)}
              style={styles.tabItem}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? theme.colors.primary : theme.colors.textMuted}
              />
              <Text style={[styles.tabLabel, { color: isActive ? theme.colors.primary : theme.colors.textMuted }]}>
                {item.label.split(' ')[0]} {/* shortened labels for mobile */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // Desktop Sidebar
  return (
    <View style={[styles.sidebar, { backgroundColor: theme.colors.backgroundSolid, borderRightColor: theme.colors.cardBorder }]}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={[styles.logoBadge, { backgroundColor: 'transparent' }]}>
          <Image source={require('../../assets/logo.jpg')} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
        </View>
        <View style={styles.brandTextContainer}>
          <Text style={[styles.brandTitle, { color: theme.colors.text }]}>Ginger Notes</Text>
          <Text style={[styles.brandSubtitle, { color: theme.colors.textMuted }]}>Smart Study Assistant</Text>
        </View>
      </View>

      {/* Quick Search */}
      <View style={[styles.searchBox, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}>
        <Ionicons name="search-outline" size={16} color={theme.colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="⌘K Quick search..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.searchInput, { color: theme.colors.text }]}
          editable={false}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>STUDY TOOLS</Text>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map(item => {
          const isActive = currentScreen === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => navigate(item.name)}
              style={[
                styles.menuItem,
                isActive && {
                  backgroundColor: theme.colors.activeTabBg,
                  borderColor: theme.colors.activeTabBorder,
                }
              ]}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isActive ? theme.colors.primary : theme.colors.textMuted}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuLabel, { color: isActive ? theme.colors.text : theme.colors.textMuted, fontWeight: isActive ? '600' : '500' }]}>
                  {item.label}
                </Text>
              </View>
              {isActive && <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Settings and Profile */}
      <View style={styles.footer}>
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
        
        {/* Theme Toggle */}
        <View style={styles.footerActionRow}>
          <View style={styles.footerActionLeft}>
            <Ionicons name="moon-outline" size={18} color={theme.colors.textMuted} />
            <Text style={[styles.footerActionLabel, { color: theme.colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={theme.isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
          <View style={styles.profileLeft}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>Student</Text>
              <Text style={[styles.profilePlan, { color: theme.colors.textMuted }]}>Free Plan</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    height: '100%',
    padding: 24,
    borderRightWidth: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  footerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  footerActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 13,
    fontWeight: '600',
  },
  profilePlan: {
    fontSize: 11,
    marginTop: 1,
  },
  // Mobile navigation styles
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom: 4,
    zIndex: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  }
});
