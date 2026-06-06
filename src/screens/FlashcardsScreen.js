import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const FlashcardsScreen = () => {
  const { theme } = useTheme();
  const { stats, decks, updateCardMastery, createNewDeck } = useApp();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [masteredCardsMap, setMasteredCardsMap] = useState({}); // track card indices mastered locally

  // New deck dialog state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckCardsCount, setNewDeckCardsCount] = useState('10');

  const statItems = [
    { label: 'Total Cards', value: stats.totalCards || 92, icon: 'layers', color: theme.colors.primary },
    { label: 'Mastered', value: stats.cardsMastered, icon: 'star', color: theme.colors.warning },
    { label: 'Due Today', value: 14, icon: 'flash', color: theme.colors.success },
  ];

  const handleOpenDeck = (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
    setCardFlipped(false);
    
    // Seed mastered map with dummy state matching current percent
    const initialMap = {};
    const masteredCount = deck.mastered;
    for (let i = 0; i < deck.cards.length; i++) {
      if (i < masteredCount) initialMap[i] = true;
    }
    setMasteredCardsMap(initialMap);
  };

  const handleToggleCardMastery = () => {
    const isMastered = !!masteredCardsMap[currentCardIndex];
    const newMap = { ...masteredCardsMap, [currentCardIndex]: !isMastered };
    setMasteredCardsMap(newMap);

    // Compute new count for the deck
    const totalMasteredInDeck = Object.values(newMap).filter(Boolean).length;
    // Scale up to overall cards ratio in the deck
    const ratio = selectedDeck.total / selectedDeck.cards.length;
    const scaledMastered = Math.round(totalMasteredInDeck * ratio);
    
    updateCardMastery(selectedDeck.id, Math.min(scaledMastered, selectedDeck.total));
  };

  const handleNextCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % selectedDeck.cards.length);
    }, 100);
  };

  const handlePrevCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
    }, 100);
  };

  const handleCreateDeckSubmit = () => {
    if (!newDeckTitle.trim()) return;
    const numCards = parseInt(newDeckCardsCount) || 10;
    createNewDeck(newDeckTitle.trim(), numCards);
    setNewDeckTitle('');
    setNewDeckCardsCount('10');
    setShowCreateModal(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: isWide ? 40 : 100 }}>
      {/* Title */}
      <View style={styles.headerTitleRow}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Flashcard Decks</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Spaced repetition for efficient memorization
        </Text>
      </View>

      {/* Mini Stats Bar */}
      <View style={styles.statsBar}>
        {statItems.map((stat, i) => (
          <Card key={i} style={styles.statCard}>
            <View style={styles.statRow}>
              <View style={[styles.statIconBadge, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{stat.label}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Decks Grid */}
      <View style={styles.decksGrid}>
        {decks.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            onPress={() => handleOpenDeck(deck)}
            style={[styles.deckCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}
          >
            <View style={styles.deckCardHeader}>
              <View style={[styles.deckIconBadge, { backgroundColor: `${deck.color}15` }]}>
                <Ionicons name="layers" size={20} color={deck.color} />
              </View>
              <View style={[styles.percentBadge, { backgroundColor: `${deck.color}12` }]}>
                <Text style={[styles.percentBadgeText, { color: deck.color }]}>{deck.percent}% done</Text>
              </View>
            </View>
            
            <Text style={[styles.deckTitle, { color: theme.colors.text }]}>{deck.title}</Text>
            <Text style={[styles.deckMeta, { color: theme.colors.textMuted }]}>
              {deck.total} cards • {deck.mastered} mastered
            </Text>

            <ProgressBar progress={deck.percent} color={deck.color} />
          </TouchableOpacity>
        ))}

        {/* Create New Deck dashed card */}
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={[styles.createCard, { borderColor: theme.colors.cardBorder, backgroundColor: 'transparent' }]}
        >
          <View style={[styles.createIconCircle, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
            <Ionicons name="add" size={24} color={theme.colors.textMuted} />
          </View>
          <Text style={[styles.createTitle, { color: theme.colors.textMuted }]}>Create New Deck</Text>
        </TouchableOpacity>
      </View>

      {/* Play Flashcards Modal */}
      {selectedDeck && selectedDeck.cards && selectedDeck.cards.length > 0 && (
        <Modal
          visible={!!selectedDeck}
          animationType="fade"
          transparent
          onRequestClose={() => setSelectedDeck(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons name="layers" size={20} color={selectedDeck.color} style={{ marginRight: 10 }} />
                  <Text style={[styles.modalTitleText, { color: theme.colors.text }]}>{selectedDeck.title} Deck</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedDeck(null)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* Progress counter */}
              <View style={styles.progressRow}>
                <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
                  Card {currentCardIndex + 1} of {selectedDeck.cards.length}
                </Text>
                <ProgressBar progress={((currentCardIndex + 1) / selectedDeck.cards.length) * 100} color={selectedDeck.color} />
              </View>

              {/* Interactive Flashcard with Flip Effect */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setCardFlipped(!cardFlipped)}
                style={[
                  styles.flashcardContainer, 
                  { 
                    backgroundColor: theme.isDarkMode ? '#1A204C' : '#F8FAFC',
                    borderColor: cardFlipped ? selectedDeck.color : theme.colors.cardBorder 
                  }
                ]}
              >
                <Text style={[styles.cardFaceLabel, { color: cardFlipped ? selectedDeck.color : theme.colors.textMuted }]}>
                  {cardFlipped ? 'ANSWER / DEFINITION' : 'QUESTION / TERM'}
                </Text>
                <ScrollView contentContainerStyle={styles.cardContentContainer}>
                  <Text style={[styles.flashcardText, { color: theme.colors.text }]}>
                    {cardFlipped ? selectedDeck.cards[currentCardIndex].a : selectedDeck.cards[currentCardIndex].q}
                  </Text>
                </ScrollView>
                <View style={styles.flipPrompt}>
                  <Ionicons name="sync-outline" size={14} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                  <Text style={[styles.flipPromptText, { color: theme.colors.textMuted }]}>Tap card to flip</Text>
                </View>
              </TouchableOpacity>

              {/* Mastery toggle */}
              <TouchableOpacity
                onPress={handleToggleCardMastery}
                style={[
                  styles.masteryBtn, 
                  { 
                    backgroundColor: masteredCardsMap[currentCardIndex] ? `${theme.colors.warning}15` : 'transparent',
                    borderColor: masteredCardsMap[currentCardIndex] ? theme.colors.warning : theme.colors.cardBorder 
                  }
                ]}
              >
                <Ionicons
                  name={masteredCardsMap[currentCardIndex] ? "star" : "star-outline"}
                  size={18}
                  color={masteredCardsMap[currentCardIndex] ? theme.colors.warning : theme.colors.textMuted}
                  style={{ marginRight: 10 }}
                />
                <Text style={[styles.masteryBtnText, { color: masteredCardsMap[currentCardIndex] ? theme.colors.warning : theme.colors.text }]}>
                  {masteredCardsMap[currentCardIndex] ? 'Marked as Mastered' : 'Mark as Mastered'}
                </Text>
              </TouchableOpacity>

              {/* Navigation Actions */}
              <View style={styles.modalNavigation}>
                <Button
                  title="Previous"
                  onPress={handlePrevCard}
                  variant="outline"
                  style={{ flex: 1, marginRight: 12 }}
                  icon={<Ionicons name="arrow-back" size={16} color={theme.colors.primary} />}
                />
                <Button
                  title="Next Card"
                  onPress={handleNextCard}
                  variant="primary"
                  style={{ flex: 1 }}
                  icon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Create New Deck Modal */}
      {showCreateModal && (
        <Modal
          visible={showCreateModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder, maxWidth: 420 }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitleText, { color: theme.colors.text }]}>Create New Deck</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Deck Title</Text>
                <TextInput
                  value={newDeckTitle}
                  onChangeText={setNewDeckTitle}
                  placeholder="e.g. Organic Chemistry, Physics II"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.modalInput, { color: theme.colors.text, backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Number of Cards</Text>
                <TextInput
                  value={newDeckCardsCount}
                  onChangeText={setNewDeckCardsCount}
                  keyboardType="numeric"
                  placeholder="e.g. 10, 20"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.modalInput, { color: theme.colors.text, backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}
                />
              </View>

              <View style={styles.modalNavigation}>
                <Button
                  title="Cancel"
                  onPress={() => setShowCreateModal(false)}
                  variant="outline"
                  style={{ flex: 1, marginRight: 12 }}
                />
                <Button
                  title="Create Deck"
                  onPress={handleCreateDeckSubmit}
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
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
    padding: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  decksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deckCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  deckCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deckIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  percentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  deckMeta: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  createCard: {
    width: '48%',
    height: 175,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  createIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  createTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Flashcards Play
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
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
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressRow: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  flashcardContainer: {
    height: 200,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardFaceLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  flipPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipPromptText: {
    fontSize: 11,
    fontWeight: '600',
  },
  masteryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 24,
  },
  masteryBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Create Modal Forms
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
  }
});
