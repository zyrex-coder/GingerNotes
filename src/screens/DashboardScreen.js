import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const DashboardScreen = () => {
  const { theme } = useTheme();
  const { stats, notes, toggleStarNote } = useApp();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();

  const [selectedNote, setSelectedNote] = useState(null);

  const isWide = width >= 1024;

  const statItems = [
    { label: 'Notes Scanned', value: stats.notesScanned, icon: 'camera', color: theme.colors.primary },
    { label: 'Cards Mastered', value: `${stats.cardsMastered}/${stats.totalCards || 92}`, icon: 'layers', color: theme.colors.purple },
    { label: 'Quizzes Done', value: stats.quizzesDone, icon: 'checkbox', color: theme.colors.success },
    { label: 'Study Streak', value: `${stats.streak}d`, icon: 'flame', color: theme.colors.warning },
  ];

  const quickActions = [
    { title: 'Scan a Note', desc: 'Capture & digitize', icon: 'camera-outline', color: theme.colors.primary, target: 'Scan Notes' },
    { title: 'Ask AI', desc: 'Get instant answers', icon: 'chatbubble-ellipses-outline', color: theme.colors.cyan, target: 'AI Chat' },
    { title: 'Study Cards', desc: 'Spaced repetition', icon: 'layers-outline', color: theme.colors.purple, target: 'Flashcards' },
    { title: 'Take Quiz', desc: 'Test your knowledge', icon: 'checkbox-outline', color: theme.colors.success, target: 'Quizzes' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: isWide ? 40 : 100 }}>
      {/* Stat Cards Row */}
      <View style={[styles.statsRow, { flexDirection: isWide ? 'row' : 'row', flexWrap: 'wrap' }]}>
        {statItems.map((stat, i) => (
          <Card key={i} style={[styles.statCard, { flex: isWide ? 1 : 0, width: isWide ? 'auto' : '47%', marginRight: !isWide && i % 2 === 0 ? 12 : 0 }]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              {/* Recreate the tiny green sparkline shown in the screenshot */}
              <View style={styles.sparkline}>
                <View style={[styles.sparkDot, { backgroundColor: theme.colors.success }]} />
                <View style={[styles.sparkLineBar, { backgroundColor: theme.colors.success }]} />
              </View>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      {/* Main Grid Area */}
      <View style={[styles.grid, { flexDirection: isWide ? 'row' : 'column' }]}>
        
        {/* Left Column (Quick Actions & Recent Notes) */}
        <View style={[styles.leftColumn, { flex: isWide ? 2 : 1, marginRight: isWide ? 24 : 0 }]}>
          
          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => navigate(action.target)}
                style={[styles.actionButton, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}
              >
                <View style={[styles.actionIconBadge, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{action.title}</Text>
                  <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>{action.desc}</Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.textMuted} style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Notes */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Recent Notes</Text>
          <View style={styles.notesList}>
            {notes.map(note => (
              <TouchableOpacity
                key={note.id}
                onPress={() => setSelectedNote(note)}
                style={[styles.noteRow, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}
              >
                <View style={styles.noteLeft}>
                  <View style={[styles.noteFolderBadge, { backgroundColor: `${note.color}15` }]}>
                    <Ionicons name="folder-open" size={18} color={note.color} />
                  </View>
                  <View style={styles.noteDetails}>
                    <Text style={[styles.noteTitle, { color: theme.colors.text }]} numberOfLines={1}>{note.title}</Text>
                    <View style={styles.noteMetaRow}>
                      <Text style={[styles.noteSubject, { color: note.color }]}>{note.subject}</Text>
                      <Text style={[styles.noteMetaText, { color: theme.colors.textMuted }]}>
                        {note.pages} pages • {note.time}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleStarNote(note.id)} style={styles.starBtn}>
                  <Ionicons
                    name={note.starred ? "star" : "star-outline"}
                    size={16}
                    color={note.starred ? theme.colors.warning : theme.colors.textMuted}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Right Column (Widgets) */}
        <View style={[styles.rightColumn, { flex: isWide ? 1 : 1, marginTop: isWide ? 0 : 24 }]}>
          
          {/* Today's Goal */}
          <Card>
            <Text style={[styles.widgetTitle, { color: theme.colors.text }]}>Today's Goal</Text>
            <ProgressBar label="Biology" progress={75} color={theme.colors.primary} showPercent />
            <ProgressBar label="Math" progress={40} color={theme.colors.purple} showPercent />
            <ProgressBar label="History" progress={90} color={theme.colors.success} showPercent />
          </Card>

          {/* Upcoming Events */}
          <Card>
            <View style={styles.upcomingHeader}>
              <View style={styles.widgetTitleRow}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.widgetTitle, { color: theme.colors.text, marginBottom: 0 }]}>Upcoming</Text>
              </View>
            </View>
            <View style={styles.upcomingList}>
              <View style={styles.upcomingItem}>
                <View style={styles.upcomingLeft}>
                  <View style={[styles.upcomingDot, { backgroundColor: theme.colors.error }]} />
                  <Text style={[styles.upcomingLabel, { color: theme.colors.text }]}>Biology Final Exam</Text>
                </View>
                <Text style={[styles.upcomingDate, { color: theme.colors.textMuted }]}>Jun 10</Text>
              </View>
              <View style={styles.upcomingItem}>
                <View style={styles.upcomingLeft}>
                  <View style={[styles.upcomingDot, { backgroundColor: theme.colors.warning }]} />
                  <Text style={[styles.upcomingLabel, { color: theme.colors.text }]}>History Essay Due</Text>
                </View>
                <Text style={[styles.upcomingDate, { color: theme.colors.textMuted }]}>Jun 12</Text>
              </View>
              <View style={styles.upcomingItem}>
                <View style={styles.upcomingLeft}>
                  <View style={[styles.upcomingDot, { backgroundColor: theme.colors.success }]} />
                  <Text style={[styles.upcomingLabel, { color: theme.colors.text }]}>Math Problem Set</Text>
                </View>
                <Text style={[styles.upcomingDate, { color: theme.colors.textMuted }]}>Jun 14</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigate('Study Planner')} style={styles.plannerLink}>
              <Text style={[styles.plannerLinkText, { color: theme.colors.primary }]}>View planner</Text>
              <Ionicons name="arrow-forward" size={12} color={theme.colors.primary} />
            </TouchableOpacity>
          </Card>

          {/* AI Tip Card */}
          <TouchableOpacity
            onPress={() => navigate('AI Chat')}
            style={[styles.aiTipCard, { backgroundColor: theme.isDarkMode ? '#1E295D' : '#EFF6FF', borderColor: theme.isDarkMode ? '#3B82F6' : '#93C5FD' }]}
          >
            <View style={styles.tipHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.tipTitle, { color: theme.colors.primary }]}>AI TIP</Text>
            </View>
            <Text style={[styles.tipText, { color: theme.colors.text }]}>
              Try the Pomodoro technique — 25 min focus, 5 min break. Ask Ginger AI to create a plan for you!
            </Text>
            <Button
              title="Ask AI"
              onPress={() => navigate('AI Chat')}
              variant="primary"
              size="small"
              style={styles.tipBtn}
              icon={<Ionicons name="arrow-forward" size={14} color="#FFFFFF" />}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Note View Modal */}
      {selectedNote && (
        <Modal
          visible={!!selectedNote}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedNote(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <View style={[styles.modalNoteIconBadge, { backgroundColor: `${selectedNote.color}15` }]}>
                    <Ionicons name="document-text" size={20} color={selectedNote.color} />
                  </View>
                  <View>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{selectedNote.title}</Text>
                    <Text style={[styles.modalSub, { color: selectedNote.color }]}>{selectedNote.subject} • {selectedNote.pages} pages</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedNote(null)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={[styles.noteBodyText, { color: theme.colors.text }]}>{selectedNote.content}</Text>
              </ScrollView>
              <View style={styles.modalFooter}>
                <Button title="Summarize with AI" onPress={() => { setSelectedNote(null); navigate('AI Chat'); }} style={{ marginRight: 12, flex: 1 }} />
                <Button title="Close" onPress={() => setSelectedNote(null)} variant="outline" style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  statsRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    minWidth: 150,
    marginRight: 16,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 2,
  },
  sparkLineBar: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  grid: {
    width: '100%',
  },
  leftColumn: {
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  actionIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTextContainer: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  notesList: {
    flexDirection: 'column',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  noteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteFolderBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  noteDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteSubject: {
    fontSize: 11,
    fontWeight: '700',
    marginRight: 8,
  },
  noteMetaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  starBtn: {
    padding: 6,
  },
  rightColumn: {
    justifyContent: 'flex-start',
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingList: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  upcomingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  upcomingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  upcomingDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  plannerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  plannerLinkText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  aiTipCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  tipBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalNoteIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    maxWidth: 320,
  },
  modalSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  modalBody: {
    flex: 1,
    marginBottom: 24,
  },
  noteBodyText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
