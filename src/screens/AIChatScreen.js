import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, useWindowDimensions, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';

export const AIChatScreen = () => {
  const { theme } = useTheme();
  const { addScannedNote } = useApp();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  // Form States
  const [notesText, setNotesText] = useState('');
  const [summaryStyle, setSummaryStyle] = useState('bullet'); // 'bullet', 'concepts', 'qa'
  const [summaryLength, setSummaryLength] = useState('medium'); // 'short', 'medium', 'long'

  // Loading & Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Analyzing study material...');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [typedOutput, setTypedOutput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  // Refs for tracking typing interval
  const typingIntervalRef = useRef(null);
  const scrollRef = useRef(null);

  // Preset Options
  const presets = [
    {
      title: "Mitosis Biology",
      icon: "leaf-outline",
      color: "#06B6D4",
      text: "Cell division is a vital process. Mitosis is the process where a single cell divides into two identical daughter cells. The stages are Prophase (chromosomes condense and spindle fibers form), Metaphase (chromosomes align at the equatorial plate), Anaphase (sister chromatids are pulled apart to opposite poles), and Telophase (nuclear envelopes reform around the two sets of chromosomes, followed by cytokinesis)."
    },
    {
      title: "Carbon Chains",
      icon: "nuclear-outline",
      color: "#8B5CF6",
      text: "Organic compounds are based on carbon atoms. Carbon chains can be straight, branched, or cyclic. Alkanes are saturated hydrocarbons containing only single bonds (e.g., methane, ethane). Alkenes are unsaturated and contain at least one double bond (e.g., ethene). Alkynes contain at least one triple bond (e.g., ethyne). Functional groups like hydroxyl (-OH) or carboxyl (-COOH) change the chemical properties significantly."
    },
    {
      title: "French Revolution",
      icon: "time-outline",
      color: "#F59E0B",
      text: "The French Revolution (1789-1799) was a period of radical social and political upheaval in France. It led to the rise of democracy and nationalism. Major causes included absolute monarchy, unequal estates system (clergy, nobility, commoners), financial bankruptcy, and Enlightenment philosophies. Key phases involved the Storming of the Bastille, the Reign of Terror led by Maximilien Robespierre, and eventually ended with the rise of Napoleon Bonaparte in 1799."
    }
  ];

  // Shifting loader messages
  useEffect(() => {
    let messageTimer;
    if (isGenerating) {
      const messages = [
        'Analyzing study material...',
        'Parsing complex terminology...',
        'Extracting core semantic units...',
        'Synthesizing key concepts...',
        'Structuring requested format...',
        'Refining final summary...'
      ];
      let msgIndex = 0;
      messageTimer = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setLoaderMessage(messages[msgIndex]);
      }, 700);
    }
    return () => {
      if (messageTimer) clearInterval(messageTimer);
    };
  }, [isGenerating]);

  // Clean up typing animation on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  const handlePresetSelect = (preset) => {
    setNotesText(preset.text);
    setCopied(false);
  };

  const handleClear = () => {
    setNotesText('');
    setGeneratedSummary('');
    setTypedOutput('');
    setCopied(false);
  };

  const startTypewriter = (textToType) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    setTypedOutput('');
    setIsTyping(true);
    
    let charsTyped = 0;
    const totalChars = textToType.length;
    const charsPerStep = 6; // chunk typing speed

    typingIntervalRef.current = setInterval(() => {
      if (charsTyped >= totalChars) {
        clearInterval(typingIntervalRef.current);
        setTypedOutput(textToType);
        setIsTyping(false);
      } else {
        charsTyped += charsPerStep;
        setTypedOutput(textToType.substring(0, charsTyped));
        
        // Auto scroll to make sure typewriter output stays visible
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 10);
      }
    }, 15);
  };

  const handleSkipTyping = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setTypedOutput(generatedSummary);
    setIsTyping(false);
  };

  const generateAiSummary = () => {
    const text = notesText.trim();
    if (!text) {
      Alert.alert("Input Required", "Please enter or paste some study notes first!");
      return;
    }

    setGeneratedSummary('');
    setTypedOutput('');
    setCopied(false);
    setIsGenerating(true);

    // Simulate analysis & thinking delay
    setTimeout(() => {
      setIsGenerating(false);

      // Determine content using keywords (aligns with index.html)
      const isMitosis = text.toLowerCase().includes("mitosis") || text.toLowerCase().includes("cell division");
      const isCarbon = text.toLowerCase().includes("carbon") || text.toLowerCase().includes("organic");
      const isFrenchRev = text.toLowerCase().includes("french") || text.toLowerCase().includes("revolution");

      let title = "Custom Study Summary";
      let summaryText = "";

      if (isMitosis) {
        title = "Mitosis Biology Summary";
        if (summaryStyle === "bullet") {
          summaryText = `• **Overview**: Mitosis is a form of eukaryotic cell division that produces two genetically identical diploid daughter cells.\n• **Prophase**: Nuclear envelope breaks down; chromosomes condense; mitotic spindle starts forming.\n• **Metaphase**: Chromosomes align perfectly along the metaphase plate (cell equator) for equal division.\n• **Anaphase**: Sister chromatids are separated by spindle fibers and pulled to opposite ends of the cell.\n• **Telophase**: Chromosomes decondense; new nuclear membranes form around each set of chromosomes; cytokinesis completes the physical split of the cytoplasm.`;
        } else if (summaryStyle === "concepts") {
          summaryText = `**1. Genetic Identity Preservation**\nMitosis preserves genetic continuity by ensuring each daughter cell receives an exact copy of the parent cell's DNA.\n\n**2. The Spindle Apparatus**\nMicrotubules attach to kinetochores on chromosomes to guide their precise alignment and separation.\n\n**3. Cytokinesis Mechanics**\nThe physical division of the cytoplasm, distinct from nuclear division (karyokinesis), completing the cell split into two independent units.`;
        } else {
          summaryText = `**Q: What is the main purpose of mitosis?**\n*A:* Mitosis is essential for growth, tissue repair, and asexual reproduction in multicellular organisms, maintaining a stable chromosome number.\n\n**Q: How does metaphase differ from anaphase?**\n*A:* During metaphase, chromosomes line up in the center. In anaphase, the sister chromatids are pulled apart to opposite poles.`;
        }
      } else if (isCarbon) {
        title = "Organic Carbon Chains Summary";
        if (summaryStyle === "bullet") {
          summaryText = `• **Carbon Hybridization**: Carbon forms 4 covalent bonds, allowing straight, branched, or cyclic molecular chains.\n• **Alkanes**: Saturated hydrocarbons with single bonds. General formula: CnH2n+2. Low chemical reactivity.\n• **Alkenes & Alkynes**: Unsaturated hydrocarbons containing double bonds (CnH2n) or triple bonds (CnH2n-2) with higher reactivity.\n• **Functional Groups**: Reactive groups like Hydroxyl (-OH) or Carboxyl (-COOH) that dictate biological/chemical functions.`;
        } else if (summaryStyle === "concepts") {
          summaryText = `**1. Tetravalency of Carbon**\nThe unique ability of carbon to form four stable covalent bonds allows it to build highly diverse and complex backbone chains.\n\n**2. Degree of Saturation**\nSaturated compounds contain only single C-C bonds (alkanes), while unsaturated ones possess double or triple bonds (alkenes/alkynes), altering reactivity.\n\n**3. Functional Group Precedence**\nThe presence of specific atoms (oxygen, nitrogen) in functional groups defines the chemical reactivity and class of the organic compound.`;
        } else {
          summaryText = `**Q: What is the difference between saturated and unsaturated hydrocarbons?**\n*A:* Saturated hydrocarbons (alkanes) have only single bonds and max hydrogens. Unsaturated hydrocarbons (alkenes, alkynes) have double/triple bonds.\n\n**Q: Why is carbon the basis of organic chemistry?**\n*A:* Carbon's tetravalency allows it to form four stable covalent bonds, facilitating infinite chain lengths and diverse molecular geometries.`;
        }
      } else if (isFrenchRev) {
        title = "French Revolution Summary";
        if (summaryStyle === "bullet") {
          summaryText = `• **Main Causes**: Extreme financial bankruptcy, a rigid Three Estates hierarchy, and the spread of radical Enlightenment ideas.\n• **Initial Spark (1789)**: The Storming of the Bastille and the creation of the Declaration of the Rights of Man.\n• **Radical Phase (1793)**: Reign of Terror led by Maximilien Robespierre; execution of King Louis XVI using the guillotine.\n• **Resolution (1799)**: The rise of general Napoleon Bonaparte ends the revolution, establishing a new imperial consulate.`;
        } else if (summaryStyle === "concepts") {
          summaryText = `**1. Collapse of the Old Regime**\nThe absolute monarchy and feudal estate systems collapsed under bankruptcy and social inequalities between classes.\n\n**2. The Reign of Terror**\nA radical phase where extreme measures were taken to protect the revolution, leading to widespread executions and dictatorship.\n\n**3. Spread of Nationalism**\nThe revolution exported liberty, equality, and nationalistic sentiments throughout Europe, permanently breaking monarchical absolute rule.`;
        } else {
          summaryText = `**Q: What were the major causes of the French Revolution?**\n*A:* Financial crises, the unfair class privileges of the Three Estates, extreme famine, and the philosophical ideals of the Enlightenment.\n\n**Q: Who was Robespierre and why is he significant?**\n*A:* He was the leader of the radical Jacobin faction who spearheaded the Reign of Terror, executing thousands of perceived counter-revolutionaries.`;
        }
      } else {
        // General text summarizer fallback (Splits input sentences)
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
        const firstSentence = sentences[0] || "Imported study notes";
        const secondSentence = sentences[1] || "Analyzed material";
        const thirdSentence = sentences[2] || "Extracted concepts";

        if (summaryStyle === "bullet") {
          summaryText = `• **Key Thesis**: ${firstSentence}.\n• **Core Subject Point**: ${secondSentence}.\n• **Supporting Material**: ${thirdSentence}.\n• **Study Recommendation**: Focus on reviewing terms, structures, and chronological relations mentioned in your material.`;
        } else if (summaryStyle === "concepts") {
          summaryText = `**1. Foundational Premise**\n${firstSentence}.\n\n**2. Structural Relationship**\n${secondSentence}.\n\n**3. Analytical Conclusion**\n${thirdSentence}.`;
        } else {
          summaryText = `**Q: What is the primary takeaway from this study text?**\n*A:* The text primarily establishes that: "${firstSentence}."\n\n**Q: What other relationships are discussed?**\n*A:* The notes highlight that: "${secondSentence}" and "${thirdSentence}."`;
        }
      }

      // Adjust output length
      if (summaryLength === "short") {
        summaryText = summaryText.split('\n\n').slice(0, 2).join('\n\n');
      } else if (summaryLength === "long") {
        summaryText += `\n\n**🎯 Study Advice & Key Vocabulary:**\n- Ensure you memorize definitions of all terms bolded above.\n- Make a set of practice flashcards for the main concepts.\n- Review this summary 10 minutes before your next study session for optimal spaced repetition retention.`;
      }

      setGeneratedTitle(title);
      setGeneratedSummary(summaryText);
      startTypewriter(summaryText);
    }, 2200);
  };

  const handleCopy = () => {
    try {
      Clipboard.setString(generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveAsNote = () => {
    if (!generatedSummary) return;

    let styleLabel = "Bullet Points";
    if (summaryStyle === "concepts") styleLabel = "Key Concepts";
    if (summaryStyle === "qa") styleLabel = "Q&As";

    const newNote = {
      title: generatedTitle || "AI Note Summary",
      subject: `AI Summary (${styleLabel})`,
      pages: summaryLength === "short" ? 1 : summaryLength === "medium" ? 2 : 3,
      color: '#10B981', // green for AI summary notes
      content: generatedSummary
    };

    addScannedNote(newNote);
    Alert.alert("Success", "Saved summary to your Notes library!");
    navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        ref={scrollRef}
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: isWide ? 40 : 100 }]}
      >
        {/* Header decoration */}
        <View style={[styles.headerBanner, { borderBottomColor: theme.colors.cardBorder }]}>
          <View style={[styles.sparkleIconContainer, { backgroundColor: `${theme.colors.success}20` }]}>
            <Ionicons name="sparkles" size={24} color={theme.colors.success} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Notes Summarizer</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
              Transform messy lecture notes or text sheets into high-fidelity summaries.
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, { flexDirection: isWide ? 'row' : 'column' }]}>
          {/* Left Block (Configuration & Input) */}
          <View style={[styles.configBlock, { flex: isWide ? 1.2 : 1, marginRight: isWide ? 20 : 0 }]}>
            
            {/* Presets Row */}
            <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>Sample Presets</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.presetsRow}
              contentContainerStyle={styles.presetsContent}
            >
              {presets.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handlePresetSelect(preset)}
                  style={[
                    styles.presetCard, 
                    { 
                      backgroundColor: theme.colors.cardBg, 
                      borderColor: theme.colors.cardBorder 
                    }
                  ]}
                >
                  <View style={[styles.presetIconWrap, { backgroundColor: `${preset.color}15` }]}>
                    <Ionicons name={preset.icon} size={16} color={preset.color} />
                  </View>
                  <Text style={[styles.presetCardText, { color: theme.colors.text }]}>{preset.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Main Input Text Field */}
            <View style={styles.inputHeadingRow}>
              <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>Paste Study Notes</Text>
              {notesText.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                  <Ionicons name="close-circle-outline" size={16} color={theme.colors.error} />
                  <Text style={[styles.clearBtnText, { color: theme.colors.error }]}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: theme.colors.inputBg, 
                borderColor: theme.colors.inputBorder 
              }
            ]}>
              <TextInput
                multiline
                numberOfLines={8}
                value={notesText}
                onChangeText={(val) => { setNotesText(val); setCopied(false); }}
                placeholder="Type, paste, or select a quick study preset to test the summarizer..."
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.textInput, { color: theme.colors.text }]}
                editable={!isGenerating}
              />
              <Text style={[styles.charCountText, { color: theme.colors.textMuted }]}>
                {notesText.length} characters
              </Text>
            </View>

            {/* Style Selector */}
            <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 16 }]}>Summary Style</Text>
            <View style={styles.tabSelectorRow}>
              {[
                { key: 'bullet', label: 'Bullet Points', icon: 'list-outline' },
                { key: 'concepts', label: 'Key Concepts', icon: 'bulb-outline' },
                { key: 'qa', label: 'Q&As', icon: 'help-circle-outline' }
              ].map((styleOpt) => {
                const isActive = summaryStyle === styleOpt.key;
                return (
                  <TouchableOpacity
                    key={styleOpt.key}
                    onPress={() => setSummaryStyle(styleOpt.key)}
                    disabled={isGenerating}
                    style={[
                      styles.tabButton,
                      { 
                        backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBg,
                        borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder
                      }
                    ]}
                  >
                    <Ionicons name={styleOpt.icon} size={14} color={isActive ? '#FFFFFF' : theme.colors.textMuted} style={{ marginRight: 6 }} />
                    <Text style={[styles.tabButtonText, { color: isActive ? '#FFFFFF' : theme.colors.text }]}>
                      {styleOpt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Length Selector */}
            <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 16 }]}>Output Length</Text>
            <View style={styles.tabSelectorRow}>
              {[
                { key: 'short', label: 'Short', icon: 'hourglass-outline' },
                { key: 'medium', label: 'Medium', icon: 'resize-outline' },
                { key: 'long', label: 'In-Depth', icon: 'expand-outline' }
              ].map((lengthOpt) => {
                const isActive = summaryLength === lengthOpt.key;
                return (
                  <TouchableOpacity
                    key={lengthOpt.key}
                    onPress={() => setSummaryLength(lengthOpt.key)}
                    disabled={isGenerating}
                    style={[
                      styles.tabButton,
                      { 
                        backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBg,
                        borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder
                      }
                    ]}
                  >
                    <Ionicons name={lengthOpt.icon} size={14} color={isActive ? '#FFFFFF' : theme.colors.textMuted} style={{ marginRight: 6 }} />
                    <Text style={[styles.tabButtonText, { color: isActive ? '#FFFFFF' : theme.colors.text }]}>
                      {lengthOpt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Generate Trigger Button */}
            <TouchableOpacity
              onPress={generateAiSummary}
              disabled={isGenerating || !notesText.trim()}
              style={[
                styles.generateBtn,
                { 
                  backgroundColor: notesText.trim() && !isGenerating ? theme.colors.primary : `${theme.colors.primary}40`,
                  marginTop: 24
                }
              ]}
            >
              <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate Summary</Text>
            </TouchableOpacity>

          </View>

          {/* Right Block (Output Results Display) */}
          <View style={[styles.resultBlock, { flex: isWide ? 1 : 1, marginTop: isWide ? 0 : 24 }]}>
            
            {/* Not generated yet placeholder state */}
            {!isGenerating && !generatedSummary && (
              <View style={[styles.placeholderCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
                <Ionicons name="sparkles-outline" size={40} color={theme.colors.success} style={{ marginBottom: 16 }} />
                <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Awaiting Input</Text>
                <Text style={[styles.placeholderDesc, { color: theme.colors.textMuted }]}>
                  Configure your style and length, paste your messy study materials on the left, and hit Generate to see the magic.
                </Text>
              </View>
            )}

            {/* Generation loading screen card */}
            {isGenerating && (
              <View style={[styles.loaderCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
                <ActivityIndicator size="large" color={theme.colors.success} style={{ marginBottom: 16 }} />
                <Text style={[styles.loaderTitle, { color: theme.colors.text }]}>Study Engine Active</Text>
                <Text style={[styles.loaderMessageText, { color: theme.colors.success }]}>{loaderMessage}</Text>
                <Text style={[styles.loaderSubtext, { color: theme.colors.textMuted }]}>
                  Distilling complex definitions & organizing study parameters.
                </Text>
              </View>
            )}

            {/* Generated summaries display card */}
            {(generatedSummary.length > 0 || typedOutput.length > 0) && !isGenerating && (
              <View style={[styles.outputCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
                
                {/* Meta header bar */}
                <View style={[styles.outputMetaHeader, { borderBottomColor: theme.colors.cardBorder }]}>
                  <View>
                    <Text style={[styles.outputSubjectTitle, { color: theme.colors.success }]}>
                      {generatedTitle}
                    </Text>
                    <Text style={[styles.outputParamsSub, { color: theme.colors.textMuted }]}>
                      Style: {summaryStyle === 'bullet' ? 'Bullet Points' : summaryStyle === 'concepts' ? 'Key Concepts' : 'Questions & Answers'} • {summaryLength === 'short' ? 'Short' : summaryLength === 'medium' ? 'Medium' : 'In-Depth'}
                    </Text>
                  </View>
                  
                  {/* Quick Copy Icon */}
                  <TouchableOpacity onPress={handleCopy} style={[styles.copyIconBtn, { backgroundColor: copied ? `${theme.colors.success}20` : 'transparent' }]}>
                    <Ionicons 
                      name={copied ? "checkmark-done-circle" : "copy-outline"} 
                      size={20} 
                      color={copied ? theme.colors.success : theme.colors.textMuted} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Body Content containing typed text stream */}
                <ScrollView style={styles.outputScroll} nestedScrollEnabled>
                  <Text style={[styles.outputBodyText, { color: theme.colors.text }]}>
                    {typedOutput}
                    {isTyping && <Text style={{ color: theme.colors.primary }}>█</Text>}
                  </Text>
                </ScrollView>

                {/* Skipper row if typewriter is currently moving */}
                {isTyping && (
                  <TouchableOpacity onPress={handleSkipTyping} style={styles.skipBtn}>
                    <Ionicons name="play-forward-outline" size={14} color={theme.colors.textMuted} />
                    <Text style={[styles.skipBtnText, { color: theme.colors.textMuted }]}>Skip animation</Text>
                  </TouchableOpacity>
                )}

                {/* Primary Action Button Bar */}
                <View style={[styles.actionRow, { borderTopColor: theme.colors.cardBorder }]}>
                  <TouchableOpacity 
                    onPress={handleCopy} 
                    style={[
                      styles.actionCardBtn, 
                      { 
                        backgroundColor: theme.colors.inputBg, 
                        borderColor: theme.colors.cardBorder 
                      }
                    ]}
                  >
                    <Ionicons name={copied ? "checkmark-done-outline" : "copy-outline"} size={16} color={copied ? theme.colors.success : theme.colors.text} style={{ marginRight: 6 }} />
                    <Text style={[styles.actionCardBtnText, { color: theme.colors.text }]}>
                      {copied ? "Copied!" : "Copy Summary"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleSaveAsNote} 
                    disabled={isTyping}
                    style={[
                      styles.actionCardBtn, 
                      { 
                        backgroundColor: isTyping ? `${theme.colors.success}40` : theme.colors.success,
                        borderColor: 'transparent'
                      }
                    ]}
                  >
                    <Ionicons name="save-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={[styles.actionCardBtnText, { color: '#FFFFFF' }]}>
                      Save Study Note
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            )}

          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    marginBottom: 24,
  },
  sparkleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 18,
  },
  gridContainer: {
    width: '100%',
  },
  configBlock: {
    flexDirection: 'column',
  },
  resultBlock: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  presetsRow: {
    marginBottom: 16,
    maxHeight: 44,
  },
  presetsContent: {
    alignItems: 'center',
    paddingRight: 10,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  presetIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  presetCardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
  },
  textInput: {
    fontSize: 14,
    fontWeight: '500',
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    lineHeight: 20,
  },
  charCountText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 8,
  },
  tabSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: 300,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderDesc: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  loaderCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  loaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  loaderMessageText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  loaderSubtext: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  outputCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    minHeight: 380,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    flexDirection: 'column',
  },
  outputMetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    marginBottom: 14,
  },
  outputSubjectTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  outputParamsSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  copyIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputScroll: {
    flex: 1,
    minHeight: 180,
    maxHeight: 280,
  },
  outputBodyText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  skipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    paddingTop: 16,
    marginTop: 16,
  },
  actionCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1.5,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  actionCardBtnText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
