import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const ScanNotesScreen = () => {
  const { theme } = useTheme();
  const { addScannedNote } = useApp();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const [scanning, setScanning] = useState(false);
  const [extractedNote, setExtractedNote] = useState(null);

  const mockNoteTemplates = [
    {
      title: 'Physics — Quantum Mechanics Intro',
      subject: 'Physics',
      pages: 2,
      color: '#06B6D4',
      content: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.\n\nKey Concepts:\n1. Wave-Particle Duality: Light and matter exhibit both wave-like and particle-like properties.\n2. Planck\'s Constant: h = 6.626 x 10^-34 J·s, defines the scale of quantum effects.\n3. Schrödinger Equation: Predicts the future behavior of a dynamic system, yielding the wave function (ψ).'
    },
    {
      title: 'Chemistry — Organic Carbon Chains',
      subject: 'Chemistry',
      pages: 5,
      color: '#EF4444',
      content: 'Organic chemistry focuses on compounds containing covalent carbon-hydrogen bonds.\n\nStructure Properties:\n- Alkanes: Single bonds (Saturated hydrocarbons), general formula CnH2n+2.\n- Alkenes: Contains at least one carbon-carbon double bond, general formula CnH2n.\n- Alkynes: Contains at least one carbon-carbon triple bond, general formula CnH2n-2.\n- Functional Groups: Hydroxyl (-OH), Carboxyl (-COOH), Amino (-NH2).'
    },
    {
      title: 'History — French Revolution Key Figures',
      subject: 'History',
      pages: 3,
      color: '#8B5CF6',
      content: 'The French Revolution (1789-1799) was a period of radical political and societal change in France.\n\nKey Figures:\n- Louis XVI: King of France, executed in 1793 during the revolution.\n- Maximilien Robespierre: Leader of the Jacobins, heavily associated with the Reign of Terror.\n- Napoleon Bonaparte: General who rose to prominence and ended the revolution in 1799, establishing the French Consulate.'
    }
  ];

  const handleSimulateScan = (template) => {
    setScanning(true);
    setExtractedNote(null);

    setTimeout(() => {
      setScanning(false);
      setExtractedNote(template);
      // Add to global state so it populates the Dashboard immediately!
      addScannedNote({
        title: template.title,
        subject: template.subject,
        pages: template.pages,
        color: template.color,
        content: template.content
      });
    }, 2500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: isWide ? 40 : 100 }}>
      {/* Title */}
      <View style={styles.headerTitleRow}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Scan Notes</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Upload handwritten or printed notes — AI will extract and organize them
        </Text>
      </View>

      {/* Main Row / Columns */}
      <View style={[styles.mainRow, { flexDirection: isWide ? 'row' : 'column' }]}>
        
        {/* Left Column (Drop Notes) */}
        <View style={[styles.leftCol, { flex: isWide ? 1.2 : 1, marginRight: isWide ? 24 : 0 }]}>
          <Card style={styles.dropCard}>
            <View style={styles.dropZone}>
              <View style={[styles.uploadCircle, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
              </View>
              <Text style={[styles.dropTitle, { color: theme.colors.text }]}>Drop your notes here</Text>
              <Text style={[styles.dropSubtitle, { color: theme.colors.textMuted }]}>PNG, JPG, PDF supported</Text>
              
              {/* Simulator Selector */}
              <Text style={[styles.selectorLabel, { color: theme.colors.textMuted }]}>
                Select a document template below to simulate OCR:
              </Text>
              <View style={styles.templateList}>
                {mockNoteTemplates.map((tmpl, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => !scanning && handleSimulateScan(tmpl)}
                    style={[
                      styles.templateBtn, 
                      { 
                        backgroundColor: theme.colors.inputBg, 
                        borderColor: theme.colors.inputBorder 
                      }
                    ]}
                  >
                    <Ionicons name="document-text-outline" size={16} color={tmpl.color} style={{ marginRight: 8 }} />
                    <Text style={[styles.templateBtnText, { color: theme.colors.text }]} numberOfLines={1}>
                      {tmpl.title.split(' — ')[1]}
                    </Text>
                    <Ionicons name="sparkles" size={12} color={theme.colors.primary} style={{ marginLeft: 'auto' }} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.orText, { color: theme.colors.textMuted }]}>— OR —</Text>

              <Button
                title="Browse files"
                onPress={() => handleSimulateScan(mockNoteTemplates[0])}
                disabled={scanning}
                variant="outline"
                style={styles.browseBtn}
                icon={<Ionicons name="folder-open-outline" size={16} color={theme.colors.primary} />}
              />
            </View>
          </Card>

          {/* Tips Card */}
          <Card style={styles.tipsCard}>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>TIPS</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipRow}>
                <Ionicons name="sparkles" size={14} color={theme.colors.cyan} style={styles.tipStar} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>Use good lighting for clearer scans</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="sparkles" size={14} color={theme.colors.cyan} style={styles.tipStar} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>Flatten pages before scanning</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="sparkles" size={14} color={theme.colors.cyan} style={styles.tipStar} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>Works with printed & handwritten notes</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Right Column (Extracted Output) */}
        <View style={[styles.rightCol, { flex: isWide ? 1.5 : 1, marginTop: isWide ? 0 : 24 }]}>
          <Card style={styles.extractedCard}>
            {scanning ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginBottom: 16 }} />
                <Text style={[styles.loaderText, { color: theme.colors.text }]}>Extracting text and organizing with AI...</Text>
                <Text style={[styles.loaderSubtext, { color: theme.colors.textMuted }]}>Formatting sections and syntax highlighting</Text>
              </View>
            ) : extractedNote ? (
              <ScrollView style={styles.extractedContent}>
                <View style={styles.extractedHeader}>
                  <View style={[styles.extractedBadge, { backgroundColor: `${extractedNote.color}15` }]}>
                    <Ionicons name="checkmark-circle" size={18} color={extractedNote.color} />
                  </View>
                  <View>
                    <Text style={[styles.extractedNoteTitle, { color: theme.colors.text }]}>{extractedNote.title}</Text>
                    <Text style={[styles.extractedNoteMeta, { color: extractedNote.color }]}>
                      {extractedNote.subject} • {extractedNote.pages} Pages • Extracted Successfully
                    </Text>
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                <Text style={[styles.noteBody, { color: theme.colors.text }]}>{extractedNote.content}</Text>
                <View style={styles.completionAlert}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.colors.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.completionText, { color: theme.colors.success }]}>
                    Saved to Dashboard under "Recent Notes". You can now query this note with Ginger AI!
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.placeholderContainer}>
                <View style={[styles.placeholderCircle, { backgroundColor: theme.isDarkMode ? '#1E2552' : '#F1F5F9' }]}>
                  <Ionicons name="document-text-outline" size={40} color={theme.colors.textMuted} />
                </View>
                <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Extracted notes appear here</Text>
                <Text style={[styles.placeholderSubtitle, { color: theme.colors.textMuted }]}>
                  Upload a note on the left and AI will extract and organize its contents dynamically
                </Text>
              </View>
            )}
          </Card>
        </View>

      </View>
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
  dropCard: {
    padding: 24,
    marginBottom: 20,
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  uploadCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  dropSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  templateList: {
    width: '100%',
    marginBottom: 16,
  },
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    width: '100%',
  },
  templateBtnText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  orText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 16,
  },
  browseBtn: {
    width: '100%',
  },
  tipsCard: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  tipsList: {
    flexDirection: 'column',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipStar: {
    marginRight: 10,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  extractedCard: {
    padding: 24,
    minHeight: 450,
    justifyContent: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  loaderSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  extractedContent: {
    flex: 1,
  },
  extractedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  extractedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  extractedNoteTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  extractedNoteMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1.5,
    marginBottom: 20,
  },
  noteBody: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 20,
  },
  completionAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  placeholderSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  }
});
