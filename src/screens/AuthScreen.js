import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export const AuthScreen = () => {
  const { theme } = useTheme();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSignIn = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Input Required", "Please enter both email address and password.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address (e.g., student@gingernotes.com).");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      login(trimmedEmail, trimmedPassword);
      setIsLoading(false);
      if (isSignup) {
        Alert.alert("Success", "Account created successfully! Welcome to GingerNotes.");
      }
    }, 1000);
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundSolid }]}>
      {/* Premium glowing blobs */}
      <View style={[styles.glowBlob1, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.glowBlob2, { backgroundColor: theme.colors.purple || '#8B5CF6' }]} />

      <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
        {/* Brand Logo & Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { shadowColor: theme.colors.primary }]}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="cover" />
          </View>
          <Text style={[styles.brandTitle, { color: theme.colors.text }]}>GingerNotes</Text>
          <Text style={[styles.brandSubtitle, { color: theme.colors.textMuted }]}>
            {isSignup ? 'Join GingerNotes today' : 'Smart Notes Summary & Study Planning'}
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>Email Address</Text>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: theme.colors.inputBg, 
                borderColor: focusedField === 'email' ? theme.colors.primary : theme.colors.cardBorder,
                shadowColor: theme.colors.primary,
                shadowOpacity: focusedField === 'email' ? 0.2 : 0,
                shadowRadius: 8,
                elevation: focusedField === 'email' ? 4 : 0
              }
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={18} 
                color={focusedField === 'email' ? theme.colors.primary : theme.colors.textMuted} 
                style={styles.inputIcon} 
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="student@gingernotes.com"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>Password</Text>
              {!isSignup && (
                <TouchableOpacity>
                  <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot?</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: theme.colors.inputBg, 
                borderColor: focusedField === 'password' ? theme.colors.primary : theme.colors.cardBorder,
                shadowColor: theme.colors.primary,
                shadowOpacity: focusedField === 'password' ? 0.2 : 0,
                shadowRadius: 8,
                elevation: focusedField === 'password' ? 4 : 0
              }
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={18} 
                color={focusedField === 'password' ? theme.colors.primary : theme.colors.textMuted} 
                style={styles.inputIcon} 
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isLoading}
            style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {isSignup ? 'Create Account' : 'Sign In'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle Mode */}
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.toggleRow}>
          <Text style={[styles.toggleText, { color: theme.colors.textMuted }]}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={[styles.toggleAction, { color: theme.colors.primary }]}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  glowBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    filter: 'blur(100px)',
    opacity: 0.15,
    top: '10%',
    left: '10%',
  },
  glowBlob2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    filter: 'blur(100px)',
    opacity: 0.15,
    bottom: '10%',
    right: '10%',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 32,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  inputGroup: {
    width: '100%',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    padding: 0,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleAction: {
    fontWeight: '700',
  },
});
