import React from 'react';
import { StyleSheet, View, SafeAreaView, useWindowDimensions, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NavigationProvider, useNavigation } from './src/context/NavigationContext';
import { AppProvider } from './src/context/AppContext';
import { Sidebar } from './src/components/Sidebar';
import { Header } from './src/components/Header';

import { DashboardScreen } from './src/screens/DashboardScreen';
import { ScanNotesScreen } from './src/screens/ScanNotesScreen';
import { StudyPlannerScreen } from './src/screens/StudyPlannerScreen';

const MainAppContent = () => {
  const { theme } = useTheme();
  const { currentScreen } = useNavigation();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Scan Notes':
        return <ScanNotesScreen />;
      case 'Study Planner':
        return <StudyPlannerScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.backgroundSolid }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.container, { flexDirection: isWide ? 'row' : 'column', backgroundColor: theme.colors.backgroundSolid }]}>
        
        {/* Left persistent sidebar for wide screens, or invisible on mobile */}
        {isWide && <Sidebar />}

        {/* Right content view */}
        <View style={styles.mainContentWrapper}>
          
          {/* Header (Visible ONLY on mobile devices) */}
          <Header />

          {/* Active Screen Frame */}
          <View style={[styles.screenFrame, { backgroundColor: theme.colors.backgroundSolid }]}>
            {renderScreen()}
          </View>

          {/* Bottom Tabs (Visible ONLY on mobile devices) */}
          {!isWide && <Sidebar />}

        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppProvider>
          <MainAppContent />
        </AppProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  mainContentWrapper: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
  screenFrame: {
    flex: 1,
    height: '100%',
  }
});
