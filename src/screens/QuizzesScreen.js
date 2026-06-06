import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const QuizzesScreen = () => {
  const { theme } = useTheme();
  const { stats, quizzes, completeQuiz } = useApp();
  const { width } = useWindowDimensions();

  const isWide = width >= 1024;

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsSubmitted(false);
    setCorrectAnswersCount(0);
    setShowResults(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null) return;
    
    const correctIdx = activeQuiz.questions[currentQuestionIdx].correct;
    if (selectedOptionIdx === correctIdx) {
      setCorrectAnswersCount(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIdx === activeQuiz.questions.length - 1;
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsSubmitted(false);
    }
  };

  const handleFinishQuiz = () => {
    const percentScore = Math.round((correctAnswersCount / activeQuiz.questions.length) * 100);
    completeQuiz(percentScore);
    setActiveQuiz(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: isWide ? 40 : 100 }}>
      {/* Title */}
      <View style={styles.headerTitleRow}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Quizzes</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Test your knowledge with adaptive quizzes
        </Text>
      </View>

      {/* Streak Hero Banner Card */}
      <View style={[styles.heroBanner, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.heroLeft}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Last Quiz Score: {stats.lastQuizScore}%</Text>
            <Text style={styles.heroSubtitle}>Great job! Keep it up to improve your streak 🔥</Text>
          </View>
        </View>
        <View style={styles.heroRight}>
          <Text style={styles.streakValue}>{stats.streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Choose a Topic</Text>

      {/* Grid of Quiz Cards */}
      <View style={styles.quizzesGrid}>
        {quizzes.map((quiz) => {
          const badgeColor = quiz.difficulty === 'Easy' ? theme.colors.success : quiz.difficulty === 'Medium' ? theme.colors.warning : theme.colors.error;
          return (
            <TouchableOpacity
              key={quiz.id}
              onPress={() => handleStartQuiz(quiz)}
              style={[styles.quizCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}
            >
              <View style={styles.quizCardHeader}>
                <View style={[styles.quizIconBadge, { backgroundColor: `${quiz.color}15` }]}>
                  <Ionicons name="checkbox-outline" size={20} color={quiz.color} />
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: `${badgeColor}15` }]}>
                  <Text style={[styles.difficultyText, { color: badgeColor }]}>{quiz.difficulty}</Text>
                </View>
              </View>

              <Text style={[styles.quizTitle, { color: theme.colors.text }]}>{quiz.title}</Text>
              <Text style={[styles.quizMeta, { color: theme.colors.textMuted }]}>
                {quiz.questionsCount} questions • {quiz.duration} min
              </Text>

              <TouchableOpacity onPress={() => handleStartQuiz(quiz)} style={styles.startQuizLink}>
                <Text style={[styles.startQuizText, { color: quiz.color }]}>Start Quiz</Text>
                <Ionicons name="chevron-forward" size={12} color={quiz.color} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quiz Modal Overlay */}
      {activeQuiz && (
        <Modal
          visible={!!activeQuiz}
          animationType="slide"
          transparent
          onRequestClose={() => setActiveQuiz(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }]}>
              
              {!showResults ? (
                <>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitleText, { color: theme.colors.text }]}>
                      {activeQuiz.title} Quiz
                    </Text>
                    <TouchableOpacity onPress={() => setActiveQuiz(null)}>
                      <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.quizProgressRow}>
                    <Text style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
                      Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                    </Text>
                    <ProgressBar 
                      progress={((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100} 
                      color={activeQuiz.color} 
                    />
                  </View>

                  {/* Question Box */}
                  <View style={styles.questionBox}>
                    <Text style={[styles.questionText, { color: theme.colors.text }]}>
                      {activeQuiz.questions[currentQuestionIdx].q}
                    </Text>
                  </View>

                  {/* Options List */}
                  <View style={styles.optionsList}>
                    {activeQuiz.questions[currentQuestionIdx].options.map((option, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const correctIdx = activeQuiz.questions[currentQuestionIdx].correct;
                      
                      let optionBg = theme.colors.inputBg;
                      let optionBorder = theme.colors.inputBorder;
                      let optionTextColor = theme.colors.text;

                      if (isSelected) {
                        optionBg = `${activeQuiz.color}15`;
                        optionBorder = activeQuiz.color;
                      }

                      if (isSubmitted) {
                        if (idx === correctIdx) {
                          optionBg = 'rgba(16, 185, 129, 0.15)';
                          optionBorder = theme.colors.success;
                          optionTextColor = theme.colors.success;
                        } else if (isSelected && selectedOptionIdx !== correctIdx) {
                          optionBg = 'rgba(239, 68, 68, 0.15)';
                          optionBorder = theme.colors.error;
                          optionTextColor = theme.colors.error;
                        }
                      }

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={isSubmitted}
                          onPress={() => setSelectedOptionIdx(idx)}
                          style={[styles.optionRow, { backgroundColor: optionBg, borderColor: optionBorder }]}
                        >
                          <View style={[
                            styles.optionRadio, 
                            { borderColor: isSelected ? activeQuiz.color : theme.colors.textMuted },
                            isSelected && { backgroundColor: activeQuiz.color }
                          ]}>
                            {isSelected && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                          </View>
                          <Text style={[styles.optionText, { color: optionTextColor }]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Submitting/Navigation Actions */}
                  <View style={styles.quizActionRow}>
                    {!isSubmitted ? (
                      <Button
                        title="Submit Answer"
                        onPress={handleSubmitAnswer}
                        disabled={selectedOptionIdx === null}
                        variant="primary"
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <Button
                        title={currentQuestionIdx === activeQuiz.questions.length - 1 ? "Finish and View Results" : "Next Question"}
                        onPress={handleNextQuestion}
                        variant="success"
                        style={{ width: '100%' }}
                        icon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
                      />
                    )}
                  </View>
                </>
              ) : (
                // Results Panel
                <View style={styles.resultsContainer}>
                  <View style={[styles.resultsIconBadge, { backgroundColor: `${theme.colors.success}15` }]}>
                    <Ionicons name="trophy" size={48} color={theme.colors.success} />
                  </View>
                  <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>Quiz Completed!</Text>
                  <Text style={[styles.resultsSubtitle, { color: theme.colors.textMuted }]}>
                    You have successfully answered the questions in **{activeQuiz.title}**.
                  </Text>

                  {/* Score circle */}
                  <View style={[styles.resultsScoreBox, { borderColor: activeQuiz.color }]}>
                    <Text style={[styles.resultsScoreVal, { color: activeQuiz.color }]}>
                      {Math.round((correctAnswersCount / activeQuiz.questions.length) * 100)}%
                    </Text>
                    <Text style={[styles.resultsScoreLbl, { color: theme.colors.textMuted }]}>
                      {correctAnswersCount} of {activeQuiz.questions.length} Correct
                    </Text>
                  </View>

                  <View style={styles.streakAlert}>
                    <Ionicons name="flame" size={20} color={theme.colors.warning} style={{ marginRight: 8 }} />
                    <Text style={[styles.streakAlertText, { color: theme.colors.text }]}>
                      Streak maintained! You are on a {stats.streak}-day learning streak!
                    </Text>
                  </View>

                  <Button
                    title="Done"
                    onPress={handleFinishQuiz}
                    variant="primary"
                    style={{ width: '100%' }}
                  />
                </View>
              )}

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
  heroBanner: {
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trophyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    paddingLeft: 20,
    marginLeft: 16,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  quizzesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quizCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  quizMeta: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
  },
  startQuizLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startQuizText: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
  // Quiz Playing Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
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
  quizProgressRow: {
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  questionBox: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  optionsList: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  optionRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  quizActionRow: {
    width: '100%',
  },
  // Results panel
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultsIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  resultsSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  resultsScoreBox: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsScoreVal: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultsScoreLbl: {
    fontSize: 12,
    fontWeight: '600',
  },
  streakAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  streakAlertText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
