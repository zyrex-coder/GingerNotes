import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Switch, ScrollView, Platform, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export const SettingsModal = () => {
  const { theme } = useTheme();
  const { isSettingsVisible, setIsSettingsVisible, profile, saveSettings, deleteAccount } = useApp();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account and all study data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteAccount();
            Alert.alert("Account Deleted", "Your account has been deleted successfully.");
          }
        }
      ]
    );
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ocrMode, setOcrMode] = useState('balanced');
  const [dailyGoal, setDailyGoal] = useState('4');
  const [notifications, setNotifications] = useState(true);

  // Synchronize local states with global context when modal is displayed
  useEffect(() => {
    if (isSettingsVisible && profile) {
      setName(profile.name);
      setEmail(profile.email);
      setOcrMode(profile.ocrMode);
      setDailyGoal(profile.dailyGoal.toString());
      setNotifications(profile.notifications);
    }
  }, [isSettingsVisible, profile]);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      return;
    }

    saveSettings({
      name: name.trim(),
      email: email.trim(),
      ocrMode,
      dailyGoal: parseInt(dailyGoal) || 4,
      notifications,
    });
  };

  const ocrOptions = [
    { label: 'Balanced (Fast & Accurate)', value: 'balanced' },
    { label: 'High-Precision (Handwriting)', value: 'high-res' },
    { label: 'Ultra-Speed (Drafts)', value: 'speed' },
  ];

  return (
    <Modal
      visible={isSettingsVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setIsSettingsVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="options-outline" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>App Settings</Text>
                <Text style={[styles.modalSub, { color: theme.colors.primary }]}>Manage study preferences</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setIsSettingsVisible(false)}>
              <Ionicons name="close" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} contentContainerStyle={{ gap: 16 }}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>Your Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
                placeholder="Student"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>Your Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
                placeholder="student@gingernotes.com"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* OCR Select (Segmented Control style for native reliability and premium aesthetic) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>OCR Engine Mode</Text>
              <View style={styles.optionsContainer}>
                {ocrOptions.map(opt => {
                  const isSel = ocrMode === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setOcrMode(opt.value)}
                      style={[
                        styles.optionBtn,
                        { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder },
                        isSel && { backgroundColor: theme.colors.activeTabBg, borderColor: theme.colors.activeTabBorder }
                      ]}
                    >
                      <Text style={[styles.optionText, { color: isSel ? theme.colors.text : theme.colors.textMuted, fontWeight: isSel ? '700' : '500' }]}>
                        {opt.label.split(' ')[0]} {/* short names */}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Goal Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>Daily Study Goal (Hours)</Text>
              <TextInput
                value={dailyGoal}
                onChangeText={setDailyGoal}
                keyboardType="numeric"
                maxLength={2}
                style={[styles.input, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
                placeholder="4"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Notifications switch */}
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Text style={[styles.switchTitle, { color: theme.colors.text }]}>Daily Reminders</Text>
                <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>Receive study push notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>

            {/* Delete Account */}
            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={[styles.deleteBtn, { borderColor: theme.colors.error }]}
            >
              <Ionicons name="trash-outline" size={16} color={theme.colors.error} style={{ marginRight: 6 }} />
              <Text style={[styles.deleteBtnText, { color: theme.colors.error }]}>Delete Account</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => setIsSettingsVisible(false)}
              style={[styles.actionBtn, styles.btnOutline, { borderColor: theme.colors.cardBorder }]}
            >
              <Text style={[styles.btnOutlineText, { color: theme.colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.actionBtn, styles.btnPrimary, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.btnPrimaryText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  form: {
    flex: 1,
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    ...Platform.select({
      web: { outlineStyle: 'none' },
    }),
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  switchLeft: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: '700',
  },
  btnPrimary: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 16,
    borderStyle: 'dashed',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
