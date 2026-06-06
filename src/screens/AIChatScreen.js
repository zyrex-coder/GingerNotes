import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const AIChatScreen = () => {
  const { theme } = useTheme();
  const { chatMessages, addChatMessage } = useApp();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const [input, setInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  const scrollViewRef = useRef();

  const suggestionChips = [
    { text: 'Explain cell mitosis simply', reply: "Mitosis is cell division where one parent cell splits to form **two identical daughter cells** for growth and repair. Think of PMAT:\n\n• **P (Prophase)**: Chromosomes pack tightly.\n• **M (Metaphase)**: Chromosomes line up in the *middle*.\n• **A (Anaphase)**: Sister chromatids pull *apart*.\n• **T (Telophase)**: *Two* new nuclei form, and the cell pinches into two!" },
    { text: 'Create a study plan for my biology exam', reply: "Here is your customized **4-Day Biology Study Plan**:\n\n• **Day 1: Cellular Structure** — Focus on cell organelles, membranes, and passive/active transport.\n• **Day 2: Cell Division** — Review Mitosis vs. Meiosis (PMAT stages and genetic variation).\n• **Day 3: Energy and Enzymes** — Study Photosynthesis, Cellular Respiration, and enzyme active sites.\n• **Day 4: Practice & Review** — Take our adaptive **Cell Biology Quiz** and review flashcard cards." },
    { text: 'Summarize the French Revolution', reply: "The **French Revolution (1789–1799)** was a watershed event that ended centuries of absolute monarchy in France. \n\n**Main Causes:**\n1. Extreme financial crises.\n2. Inequality of the Three Estates (Clergy, Nobility, and Commoners).\n3. Rise of Enlightenment ideals.\n\n**Major Phases:**\n- **1789**: Storming of the Bastille & Declaration of Rights.\n- **1793**: Reign of Terror led by Robespierre; execution of King Louis XVI.\n- **1799**: Rise of Napoleon Bonaparte, marking the end of the revolution." },
    { text: 'What is the Pythagorean theorem?', reply: "The **Pythagorean Theorem** is a fundamental principle in geometry for right-angled triangles:\n\n$$\\mathbf{a^2 + b^2 = c^2}$$\n\nWhere:\n- **a** and **b** are the lengths of the two shorter legs.\n- **c** is the length of the hypotenuse (the side opposite the right angle).\n\n*Example*: If a = 3 and b = 4, then $3^2 + 4^2 = 9 + 16 = 25 = c^2$, which means the hypotenuse $c = 5$." }
  ];

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    addChatMessage('user', textToSend);
    setInput('');
    setAiThinking(true);

    // Auto-scroll
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);

    // Find custom response if it matches suggestion, otherwise generate generic
    let aiResponse = "That is an interesting topic! I've searched your scanned notes and textbook library. To master this concept, I highly recommend reviewing your **Recent Notes** or starting a quick adaptive **Quiz** on the subject. Is there a specific detail you would like me to explain?";
    
    const matchedChip = suggestionChips.find(chip => chip.text.toLowerCase() === textToSend.toLowerCase());
    if (matchedChip) {
      aiResponse = matchedChip.reply;
    }

    // Simulate AI thinking and typing response
    setTimeout(() => {
      setAiThinking(false);
      addChatMessage('ai', aiResponse);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
    }, 1800);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header Info */}
      <View style={[styles.chatHeader, { borderBottomColor: theme.colors.cardBorder }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.aiAvatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.headerName, { color: theme.colors.text }]}>Ginger AI</Text>
            <View style={styles.onlineRow}>
              <View style={[styles.pulseDot, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.onlineText, { color: theme.colors.success }]}>Online • Ready to help</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="book-outline" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="refresh-outline" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesArea}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isAi ? styles.rowAi : styles.rowUser
              ]}
            >
              {isAi && (
                <View style={[styles.msgAvatar, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isAi ? {
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.cardBorder,
                    borderBottomLeftRadius: 4,
                  } : {
                    backgroundColor: theme.colors.primary,
                    borderColor: 'transparent',
                    borderBottomRightRadius: 4,
                  }
                ]}
              >
                <Text style={[styles.msgText, { color: isAi ? theme.colors.text : '#FFFFFF' }]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}

        {aiThinking && (
          <View style={[styles.messageRow, styles.rowAi]}>
            <View style={[styles.msgAvatar, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="sparkles" size={10} color="#FFFFFF" />
            </View>
            <View style={[styles.bubble, styles.thinkingBubble, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.thinkingText, { color: theme.colors.textMuted }]}>Ginger AI is studying...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestion Chips and Input Bar */}
      <View style={styles.bottomSection}>
        {/* Suggestion Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {suggestionChips.map((chip, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => !aiThinking && handleSend(chip.text)}
              style={[styles.chip, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}
            >
              <Text style={[styles.chipText, { color: theme.colors.text }]}>{chip.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputRow, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend(input)}
            placeholder="Ask me anything about your studies..."
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.inputField, { color: theme.colors.text }]}
            editable={!aiThinking}
          />
          <TouchableOpacity
            onPress={() => handleSend(input)}
            disabled={!input.trim() || aiThinking}
            style={[
              styles.sendBtn, 
              { 
                backgroundColor: input.trim() && !aiThinking ? theme.colors.primary : `${theme.colors.primary}40` 
              }
            ]}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>Ginger AI • Powered by advanced language models</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIconBtn: {
    padding: 6,
    marginLeft: 12,
  },
  messagesArea: {
    flex: 1,
  },
  messagesList: {
    padding: 24,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  rowAi: {
    alignSelf: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    maxWidth: '75%',
  },
  msgAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 4,
  },
  bubble: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thinkingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomSection: {
    padding: 24,
    paddingTop: 10,
  },
  chipsScroll: {
    marginBottom: 12,
    maxHeight: 40,
  },
  chipsContainer: {
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    fontWeight: '500',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  }
});
