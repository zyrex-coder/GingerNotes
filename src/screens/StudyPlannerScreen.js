import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const StudyPlannerScreen = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const [events, setEvents] = useState([
    { id: '1', title: 'Biology Final Exam Prep', date: 'Jun 10', time: '14:00 - 16:00', type: 'Exam', color: theme.colors.error, done: false },
    { id: '2', title: 'History Essay Draft Due', date: 'Jun 12', time: '09:00', type: 'Assignment', color: theme.colors.warning, done: false },
    { id: '3', title: 'Math Problem Set 4', date: 'Jun 14', time: '11:30 - 13:00', type: 'Homework', color: theme.colors.success, done: true },
    { id: '4', title: 'Computer Science OOP Review', date: 'Jun 18', time: '16:00 - 18:00', type: 'Study Session', color: theme.colors.cyan, done: false },
  ]);

  const [showAddModal, setShowCreateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('Jun 20');
  const [newEventType, setNewEventType] = useState('Study Session');

  const toggleEventDone = (id) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, done: !ev.done } : ev));
  };

  const handleAddEventSubmit = () => {
    if (!newEventTitle.trim()) return;
    const colorsMap = {
      'Exam': theme.colors.error,
      'Assignment': theme.colors.warning,
      'Homework': theme.colors.success,
      'Study Session': theme.colors.cyan
    };
    const randomColor = colorsMap[newEventType] || theme.colors.primary;

    const newEv = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: newEventDate,
      time: 'Flexible',
      type: newEventType,
      color: randomColor,
      done: false
    };

    setEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setShowCreateModal(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: isWide ? 40 : 100 }}>
      {/* Title */}
      <View style={styles.headerTitleRow}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Study Planner</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Schedule study sessions, track deadlines, and track goals
        </Text>
      </View>

      {/* Main Grid Row */}
      <View style={[styles.mainRow, { flexDirection: isWide ? 'row' : 'column' }]}>
        
        {/* Left Column (Calendar grid) */}
        <View style={[styles.leftCol, { flex: isWide ? 1.6 : 1, marginRight: isWide ? 24 : 0 }]}>
          <Card style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={[styles.monthLabel, { color: theme.colors.text }]}>June 2026</Text>
              <View style={styles.calendarNav}>
                <TouchableOpacity style={styles.navBtn}>
                  <Ionicons name="chevron-back" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn}>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Weekdays Row */}
            <View style={styles.weekdaysRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <Text key={day} style={[styles.weekdayLabel, { color: theme.colors.textMuted }]}>{day}</Text>
              ))}
            </View>

            {/* Simple Grid Calendar Mock */}
            <View style={styles.daysGrid}>
              {/* Padding days for previous month */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <View key={`pad-${idx}`} style={styles.dayBox}>
                  <Text style={[styles.dayNum, { color: `${theme.colors.textMuted}30` }]}>{27 + idx}</Text>
                </View>
              ))}
              {/* June Days */}
              {Array.from({ length: 30 }).map((_, idx) => {
                const dayNum = idx + 1;
                const hasEvent = dayNum === 10 || dayNum === 12 || dayNum === 14 || dayNum === 18;
                let dotColor = '#00000000';
                if (dayNum === 10) dotColor = theme.colors.error;
                if (dayNum === 12) dotColor = theme.colors.warning;
                if (dayNum === 14) dotColor = theme.colors.success;
                if (dayNum === 18) dotColor = theme.colors.cyan;

                return (
                  <View key={`day-${dayNum}`} style={[styles.dayBox, dayNum === 6 && { backgroundColor: `${theme.colors.primary}15`, borderRadius: 10 }]}>
                    <Text style={[styles.dayNum, { color: theme.colors.text }, dayNum === 6 && { color: theme.colors.primary, fontWeight: '700' }]}>
                      {dayNum}
                    </Text>
                    {hasEvent && <View style={[styles.eventDot, { backgroundColor: dotColor }]} />}
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Right Column (Event deadlines) */}
        <View style={[styles.rightCol, { flex: isWide ? 1.2 : 1, marginTop: isWide ? 0 : 24 }]}>
          <Card>
            <View style={styles.cardHeadingRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>Events & Deadlines</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(true)} style={[styles.addBtn, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="add" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.eventsList}>
              {events.map((ev) => (
                <View key={ev.id} style={[styles.eventItemCard, { backgroundColor: theme.colors.backgroundSolid, borderColor: theme.colors.cardBorder }]}>
                  <TouchableOpacity onPress={() => toggleEventDone(ev.id)} style={styles.checkBtn}>
                    <Ionicons
                      name={ev.done ? "checkbox" : "square-outline"}
                      size={20}
                      color={ev.done ? theme.colors.success : theme.colors.textMuted}
                    />
                  </TouchableOpacity>

                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventItemTitle, { color: theme.colors.text }, ev.done && { textDecorationLine: 'line-through', opacity: 0.6 }]}>
                      {ev.title}
                    </Text>
                    <View style={styles.eventMetaRow}>
                      <View style={[styles.typeBadge, { backgroundColor: `${ev.color}15` }]}>
                        <Text style={[styles.typeBadgeText, { color: ev.color }]}>{ev.type}</Text>
                      </View>
                      <Text style={[styles.eventMetaText, { color: theme.colors.textMuted }]}>
                        {ev.date} • {ev.time}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>

      </View>

      {/* Add Event Modal */}
      {showAddModal && (
        <Modal
          visible={showAddModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitleText, { color: theme.colors.text }]}>Add New Schedule Item</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Event Title</Text>
                <TextInput
                  value={newEventTitle}
                  onChangeText={setNewEventTitle}
                  placeholder="e.g. Physics midterm, Lab report"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.modalInput, { color: theme.colors.text, backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Date</Text>
                <TextInput
                  value={newEventDate}
                  onChangeText={setNewEventDate}
                  placeholder="e.g. Jun 20, Jun 25"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.modalInput, { color: theme.colors.text, backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Type</Text>
                <View style={styles.typeSelectorRow}>
                  {['Exam', 'Assignment', 'Homework', 'Study Session'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setNewEventType(type)}
                      style={[
                        styles.typeOption, 
                        { borderColor: theme.colors.cardBorder },
                        newEventType === type && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                      ]}
                    >
                      <Text style={[styles.typeOptionText, { color: theme.colors.text }, newEventType === type && { color: '#FFFFFF' }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalNavigation}>
                <Button
                  title="Cancel"
                  onPress={() => setShowCreateModal(false)}
                  variant="outline"
                  style={{ flex: 1, marginRight: 12 }}
                />
                <Button
                  title="Add Item"
                  onPress={handleAddEventSubmit}
                  variant="primary"
                  style={{ flex: 1 }}
                />
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
  headerTitleRow: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  mainRow: {
    width: '100%',
  },
  leftCol: {
    justifyContent: 'flex-start',
  },
  rightCol: {
    justifyContent: 'flex-start',
  },
  calendarCard: {
    padding: 24,
    minHeight: 380,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  calendarNav: {
    flexDirection: 'row',
  },
  navBtn: {
    padding: 6,
    marginLeft: 12,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekdayLabel: {
    width: '13%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayBox: {
    width: '13%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '500',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  cardHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    flexDirection: 'column',
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 12,
  },
  checkBtn: {
    padding: 6,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  eventMetaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Modal Style Add
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  }
});
